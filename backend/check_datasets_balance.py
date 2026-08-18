import pandas as pd
import os

data_dir = "Data"

def safe_read_csv(path, **kw):
    try:
        df = pd.read_csv(path, **kw)
        print(f"\n✅ Loaded {path} - {df.shape[0]} rows")
        return df
    except Exception as e:
        print(f"⚠ Error reading {path}:", e)
        return None

def safe_read_excel(path, **kw):
    try:
        df = pd.read_excel(path, **kw)
        print(f"\n✅ Loaded {path} - {df.shape[0]} rows")
        return df
    except Exception as e:
        print(f"⚠ Error reading {path}:", e)
        return None


def count_labels(df, label_col='label'):
    if df is not None and label_col in df.columns:
        print(df[label_col].value_counts())
    else:
        print(f"⚠ No '{label_col}' column found. Columns available:", df.columns.tolist() if df is not None else "None")


print("==== Checking ISOT Dataset ====")
true_path = os.path.join(data_dir, "True.csv")
fake_path = os.path.join(data_dir, "Fake.csv")

true_df = safe_read_csv(true_path)
fake_df = safe_read_csv(fake_path)

true_count = len(true_df) if true_df is not None else 0
fake_count = len(fake_df) if fake_df is not None else 0

print(f"✅ True.csv count: {true_count}")
print(f"✅ Fake.csv count: {fake_count}")
print(f"👉 Total ISOT samples: {true_count + fake_count}")

# -----------------------------------------------------
print("\n==== Checking LIAR Dataset (train/test/valid) ====")
for file in ["train.tsv", "test.tsv", "valid.tsv"]:
    path = os.path.join(data_dir, file)
    try:
        df = pd.read_csv(path, sep='\t', header=None)
        print(f"\n✅ {file} - {df.shape[0]} rows")
        if df.shape[1] > 1:
            print(df[1].value_counts().head(10))
        else:
            print("⚠ Could not find label column in", file)
    except Exception as e:
        print("⚠ Error reading", file, ":", e)

# -----------------------------------------------------
print("\n==== Checking COVID Fake News Dataset ====")
covid_path = os.path.join(data_dir, "covid_fakenews.xlsx")
covid_df = safe_read_excel(covid_path)
if covid_df is not None:
    count_labels(covid_df)

# -----------------------------------------------------
print("\n==== Checking Combined Dataset ====")
combined_path = os.path.join(data_dir, "combined_dataset.csv")
combined_df = safe_read_csv(combined_path, encoding='utf-8', on_bad_lines='skip')

if combined_df is not None:
    if 'label' in combined_df.columns:
        print("\nLabel counts in combined dataset:")
        print(combined_df['label'].value_counts())
    else:
        print("⚠ No label column found in combined dataset.")