import pandas as pd
import os

data_path = os.path.join("Data", "combined_dataset.csv")

# ============ 1️⃣ ISOT Dataset (True & Fake CSVs) ============
print("📦 Loading ISOT dataset...")
true_path = os.path.join(data_path, "True.csv")
fake_path = os.path.join(data_path, "Fake.csv")

true_news = pd.read_csv(true_path)
fake_news = pd.read_csv(fake_path)

# Add labels
true_news["label"] = 1   # Real news
fake_news["label"] = 0   # Fake news

# Combine ISOT datasets
isot = pd.concat([true_news, fake_news], ignore_index=True)
# Rename if "text" column missing
if "text" not in isot.columns and "title" in isot.columns:
    isot["text"] = isot["title"]
isot = isot[["text", "label"]].rename(columns={"text": "content"})
print(f"✅ ISOT dataset loaded successfully with {len(isot)} samples.")


# ============ 2️⃣ LIAR Dataset (train, test, valid TSVs) ============
print("📦 Loading LIAR dataset...")
liar_files = ["train.tsv", "test.tsv", "valid.tsv"]
liar_dfs = []

for file in liar_files:
    path = os.path.join(data_path, file)
    if os.path.exists(path):
        df = pd.read_csv(path, sep='\t', header=None)
        liar_dfs.append(df)

liar = pd.concat(liar_dfs, ignore_index=True)
liar = liar[[1, 2]]  # Column 1 = label, Column 2 = statement
liar.columns = ["label_text", "content"]

# Convert labels to binary
liar["label"] = liar["label_text"].map(lambda x: 1 if x in ["true", "mostly-true", "half-true"] else 0)
liar = liar.drop(columns=["label_text"])
print(f"✅ LIAR dataset loaded successfully with {len(liar)} samples.")


# ============ 3️⃣ COVID Fake News Dataset ============
print("📦 Loading COVID dataset...")
covid_path = os.path.join(data_path, "covid_fakenews.xlsx")
covid = pd.read_excel(covid_path)

# Try to find text and label columns automatically
if "label" not in covid.columns:
    covid.rename(columns={covid.columns[-1]: "label"}, inplace=True)
if "content" not in covid.columns:
    covid.rename(columns={covid.columns[0]: "content"}, inplace=True)
print(f"✅ COVID dataset loaded successfully with {len(covid)} samples.")


# ============ 4️⃣ Combine All ============
print("🧩 Combining all datasets...")
combined = pd.concat([isot, liar, covid], ignore_index=True)
combined = combined.sample(frac=1, random_state=42).reset_index(drop=True)

# ============ 5️⃣ Save Combined File ============
output_path = os.path.join(data_path, "combined_dataset.csv")
combined.to_csv(output_path, index=False)

print(f"\n🎉 Combined dataset created successfully!")
print(f"📁 Saved at: {output_path}")
print(f"📰 Total combined samples: {len(combined)}")
