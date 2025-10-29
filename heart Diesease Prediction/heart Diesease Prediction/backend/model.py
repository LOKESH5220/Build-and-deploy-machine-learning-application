import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

# Load dataset
column_names = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'num'
]

df = pd.read_csv(r'C:\Users\kisha\Desktop\heart Diesease Prediction\backend\processed.cleveland.data', header=None, names=column_names)

print(df.head())
df.replace('?', np.nan, inplace=True)

# Convert columns with missing data to numeric (if not already)
for col in ['ca', 'thal']:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Impute missing values with median for simplicity
df['ca'].fillna(df['ca'].median(), inplace=True)
df['thal'].fillna(df['thal'].median(), inplace=True)


# Define features and target
X = df.drop('num', axis=1)
# Convert to binary classification: 0 = no disease, 1+ = disease
y = (df['num'] > 0).astype(int)


# Split dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create pipeline: Scale -> PCA -> SVM
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=8)),  # Increased components for better performance
    ('svm', SVC(kernel='rbf', probability=True, random_state=42))
])

# Train the model
pipeline.fit(X_train, y_train)

# Predict on test set
y_pred = pipeline.predict(X_test)

# Print classification report
print(classification_report(y_test, y_pred))

# Save model to file
joblib.dump(pipeline, 'heart_svm_pca_model.pkl')
