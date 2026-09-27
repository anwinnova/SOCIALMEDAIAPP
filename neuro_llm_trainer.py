import math
import torch
import torch.nn as nn
from torch.nn import functional as F
from torch.utils.data import Dataset, DataLoader
from typing import List, Dict, Tuple

# =====================================================================
# 1. NEURO-CLINICAL TRANSFORMER ARCHITECTURE FROM SCRATCH
# =====================================================================

class NeuroLMConfig:
    """Configuration class for Neuro-Surgical Diagnostic LLM."""
    def __init__(
        self,
        vocab_size: int = 32000,
        n_embd: int = 512,
        n_layer: int = 8,
        n_head: int = 8,
        block_size: int = 512,
        dropout: float = 0.1,
    ):
        self.vocab_size = vocab_size
        self.n_embd = n_embd
        self.n_layer = n_layer
        self.n_head = n_head
        self.block_size = block_size
        self.dropout = dropout


class CausalSelfAttention(nn.Module):
    """Multi-Head Causal Self-Attention layer."""
    def __init__(self, config: NeuroLMConfig):
        super().__init__()
        assert config.n_embd % config.n_head == 0
        self.n_head = config.n_head
        self.n_embd = config.n_embd
        
        # Key, Query, Value projections
        self.c_attn = nn.Linear(config.n_embd, 3 * config.n_embd)
        # Output projection
        self.c_proj = nn.Linear(config.n_embd, config.n_embd)
        
        self.attn_dropout = nn.Dropout(config.dropout)
        self.resid_dropout = nn.Dropout(config.dropout)
        
        # Causal mask (tril) to prevent attending to future tokens
        self.register_buffer(
            "bias",
            torch.tril(torch.ones(config.block_size, config.block_size)).view(
                1, 1, config.block_size, config.block_size
            )
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, C = x.size() # Batch, Sequence Length, Embedding Dimension
        
        # Calculate Q, K, V for all heads in batch and move head dim forward
        q, k, v = self.c_attn(x).split(self.n_embd, dim=2)
        k = k.view(B, T, self.n_head, C // self.n_head).transpose(1, 2) # (B, nh, T, hs)
        q = q.view(B, T, self.n_head, C // self.n_head).transpose(1, 2) # (B, nh, T, hs)
        v = v.view(B, T, self.n_head, C // self.n_head).transpose(1, 2) # (B, nh, T, hs)

        # Causal self-attention
        att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(k.size(-1)))
        att = att.masked_fill(self.bias[:, :, :T, :T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        att = self.attn_dropout(att)
        
        y = att @ v # (B, nh, T, T) x (B, nh, T, hs) -> (B, nh, T, hs)
        y = y.transpose(1, 2).contiguous().view(B, T, C) # Re-assemble head outputs side-by-side

        # Output projection
        return self.resid_dropout(self.c_proj(y))


class MLP(nn.Module):
    """Feed-Forward Block."""
    def __init__(self, config: NeuroLMConfig):
        super().__init__()
        self.c_fc = nn.Linear(config.n_embd, 4 * config.n_embd)
        self.gelu = nn.GELU()
        self.c_proj = nn.Linear(4 * config.n_embd, config.n_embd)
        self.dropout = nn.Dropout(config.dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.c_fc(x)
        x = self.gelu(x)
        x = self.c_proj(x)
        return self.dropout(x)


class TransformerBlock(nn.Module):
    """Single Transformer Decoder Block."""
    def __init__(self, config: NeuroLMConfig):
        super().__init__()
        self.ln_1 = nn.LayerNorm(config.n_embd)
        self.attn = CausalSelfAttention(config)
        self.ln_2 = nn.LayerNorm(config.n_embd)
        self.mlp = MLP(config)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.attn(self.ln_1(x))
        x = x + self.mlp(self.ln_2(x))
        return x


class NeuroLM(nn.Module):
    """Complete Neuro-Diagnostic Language Model built from Scratch."""
    def __init__(self, config: NeuroLMConfig):
        super().__init__()
        self.config = config

        self.transformer = nn.ModuleDict(dict(
            wte = nn.Embedding(config.vocab_size, config.n_embd),
            wpe = nn.Embedding(config.block_size, config.n_embd),
            drop = nn.Dropout(config.dropout),
            h = nn.ModuleList([TransformerBlock(config) for _ in range(config.n_layer)]),
            ln_f = nn.LayerNorm(config.n_embd),
        ))
        self.lm_head = nn.Linear(config.n_embd, config.vocab_size, bias=False)

        # Weight tying
        self.transformer.wte.weight = self.lm_head.weight

        # Initialize parameters
        self.apply(self._init_weights)

    def _init_weights(self, module):
        if isinstance(module, nn.Linear):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
            if module.bias is not None:
                torch.nn.init.zeros_(module.bias)
        elif isinstance(module, nn.Embedding):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)

    def forward(self, idx: torch.Tensor, targets: torch.Tensor = None) -> Tuple[torch.Tensor, torch.Tensor]:
        device = idx.device
        b, t = idx.size()
        assert t <= self.config.block_size, f"Cannot forward sequence of length {t}, block size is {self.config.block_size}"
        
        pos = torch.arange(0, t, dtype=torch.long, device=device) # (t)

        # Forward Token & Positional Embeddings
        tok_emb = self.transformer.wte(idx) # (b, t, n_embd)
        pos_emb = self.transformer.wpe(pos) # (t, n_embd)
        x = self.transformer.drop(tok_emb + pos_emb)

        # Forward Transformer Layers
        for block in self.transformer.h:
            x = block(x)
        x = self.transformer.ln_f(x)

        if targets is not None:
            logits = self.lm_head(x)
            loss = F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1), ignore_index=-1)
        else:
            logits = self.lm_head(x[:, -1, :]) # Only predict last token for generation
            loss = None

        return logits, loss

    @torch.no_grad()
    def generate(self, idx: torch.Tensor, max_new_tokens: int, temperature: float = 1.0, top_k: int = None):
        """Autoregressive text generation for medical reporting."""
        for _ in range(max_new_tokens):
            idx_cond = idx if idx.size(1) <= self.config.block_size else idx[:, -self.config.block_size:]
            logits, _ = self(idx_cond)
            logits = logits / temperature
            if top_k is not None:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = -float('Inf')
            probs = F.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            idx = torch.cat((idx, idx_next), dim=1)
        return idx


# =====================================================================
# 2. DATASET PREPARATION & TRAINING PIPELINE
# =====================================================================

class SyntheticNeuroDataset(Dataset):
    """Synthetic Neuro-Surgical Case Report Dataset for Scratch Training."""
    def __init__(self, num_samples: int = 1000, block_size: int = 512):
        self.block_size = block_size
        
        # Sample synthetic clinical reports for neurosurgery training
        self.clinical_templates = [
            "PATIENT CASE: 52yo M with high-grade Glioblastoma in left frontal lobe. SURGICAL PLAN: Awake craniotomy with intraoperative motor mapping. RECONSTRUCTION: 3D DTI tractography showing corticospinal tract displacement. CURATIVE STRATEGY: Gross total resection with 5-ALA fluorescence guidance and Carmustine wafer implantation.",
            "PATIENT CASE: 34yo F presenting with acoustic neuroma (vestibular schwannoma). SURGICAL PLAN: Retrosigmoid transmeatal approach. VR SIMULATION: Model confirms facial nerve displacement anteriorly. PROCEDURE: Microsurgical debulking with intraoperative facial nerve monitoring.",
            "PATIENT CASE: 61yo M with anterior communicating artery aneurysm. SURGICAL PLAN: Pterional craniotomy and clipping. VR RECONSTRUCTION: 3D angiogram confirms neck width 3.2mm. PROCEDURE: Micro-vascular clip application without arterial occlusion.",
        ]
        
        # Simple character-level tokenizer for standalone demonstration
        chars = sorted(list(set(" ".join(self.clinical_templates) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.:,-()")))
        self.vocab_size = len(chars) + 1 # +1 for padding
        self.stoi = {ch: i+1 for i, ch in enumerate(chars)}
        self.itos = {i+1: ch for i, ch in enumerate(chars)}
        self.stoi['<PAD>'] = 0
        self.itos[0] = '<PAD>'

        # Generate dataset tensors
        self.data = []
        for i in range(num_samples):
            text = self.clinical_templates[i % len(self.clinical_templates)]
            tokens = [self.stoi.get(c, 0) for c in text]
            if len(tokens) < block_size + 1:
                tokens = tokens + [0] * (block_size + 1 - len(tokens))
            else:
                tokens = tokens[:block_size + 1]
            self.data.append(torch.tensor(tokens, dtype=torch.long))

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        chunk = self.data[idx]
        x = chunk[:-1]
        y = chunk[1:]
        return x, y


def train_neuro_llm():
    """Main function to train the NeuroLM model from scratch."""
    print("🧠 Initializing NeuroLM Dataset & Tokenizer...")
    dataset = SyntheticNeuroDataset(num_samples=500, block_size=256)
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

    config = NeuroLMConfig(
        vocab_size=dataset.vocab_size,
        n_embd=256,
        n_layer=4,
        n_head=4,
        block_size=256,
        dropout=0.1
    )

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"⚡ Training NeuroLM Model on Device: {device.upper()}")
    
    model = NeuroLM(config).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

    # Training Loop
    epochs = 5
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for step, (x, y) in enumerate(dataloader):
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            logits, loss = model(x, y)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            total_loss += loss.item()

        avg_loss = total_loss / len(dataloader)
        print(f"Epoch {epoch+1}/{epochs} | Loss: {avg_loss:.4f}")

    print("\n✅ NeuroLM Model Training Complete!")
    
    # Generation Test
    model.eval()
    prompt = "PATIENT CASE: 52yo M with high-grade"
    prompt_tokens = torch.tensor([[dataset.stoi.get(c, 0) for c in prompt]], dtype=torch.long).to(device)
    generated = model.generate(prompt_tokens, max_new_tokens=100, temperature=0.8)
    generated_text = "".join([dataset.itos.get(i.item(), "") for i in generated[0]])
    print("\n🔮 Model Inferred Diagnosis & Surgical Plan Preview:")
    print("--------------------------------------------------")
    print(generated_text)
    print("--------------------------------------------------")


if __name__ == "__main__":
    train_neuro_llm()
