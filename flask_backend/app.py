from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS
import numpy as np
from sklearn.preprocessing import OneHotEncoder

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the model
with open('model_weights.pth', 'rb') as reader:
    model = pickle.load(reader)


class_names=['Asthma', 'Anemia' ,'covid-19', 'Migraine', 'Diabetes']

# Mapping from disease to examination
examination_mapping = {
    'Anemia': 'complete blood count (CBC)',
    'covid-19': 'PCR and Molecular COVID-19',
    'Migraine': 'Magnetic resonance imaging (MRI)',
    'Asthma': 'spirometer',
    'Diabetes': 'hemoglobin A1C (HbA1C)',
}

unique_cols=['cough', 'fatigue', 'dry cough', 'sensitivity to light',
       'breathlessness', 'throbbing headache', 'obesity',
       'chest tightness', 'pale', 'nausea', 'irregular sugar level',
       'wheezing', 'yellowish skin', 'anosmia', 'vomiting',
       'blurred vision', 'chest pain', 'irregular heartbeat', 'ageusia',
       'excessive hunger', 'frequent urination', 'trouble sleeping',
       'dizziness', 'depression', 'excessive thirst', 'other',
       'lightheadedness', 'diarrhea', 'neck stiffness', 'headaches',
       'sensitivity  to sound', 'vaginal infections', 'muscle aches',
       'weight loss', 'cold hands', 'high fever', 'visual disturbances',
       'irritability', 'runny nose', 'polyuria', 'slow healing sore',
       'sore throat']





# Preprocessing function (same as before)
def encode_custom_symptoms(user_symptoms):
    
    # Your encoding logic here (as defined earlier)
     # Initialize a zero array for symptoms
    encoded_symptoms = pd.Series(0, index=unique_cols)
    
    # Process and encode the user input
    for symptom in user_symptoms:
        processed_symptom = symptom.lower().strip().replace('-', ' ').replace('_', ' ')
        if processed_symptom in encoded_symptoms.index:
            encoded_symptoms[processed_symptom] = 1
    
    return encoded_symptoms
    

@app.route("/")
def home():
    return 'starting'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_symptoms = data['symptoms']
    print(data)
    print('Yes')
    # Encode symptoms
    encoded_user_symptoms = encode_custom_symptoms(user_symptoms)
    
    # Convert to array for model input
    encoded_user_array = encoded_user_symptoms.values.reshape(1, -1)
    encoded_user_array[0][25] = 1

    # Make prediction
    prediction = model.predict(encoded_user_array)
    
    pred=class_names[prediction[0]]

    # Get the corresponding examination
    examination = examination_mapping.get(pred, "No examination found")

    # Return the prediction and examination
    return jsonify({'disease': pred, 'examination': examination})

if __name__ == '__main__':
    app.run(debug=True, port=4000)



