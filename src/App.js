import React, { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    policyType: "",
    beneficiary1: "",
    beneficiary2: "",
    comments: ""
  });

  const [confidenceScores, setConfidenceScores] = useState({
    firstName: null,
    lastName: null,
    phone: null,
    policyType: null,
    beneficiary1: null,
    beneficiary2: null,
    comments: null
  });

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();
    newRecognition.continuous = true;
    newRecognition.interimResults = true;

    const handleSpeech = (e) => {
      const speechResult = Array.from(e.results)
        .map(result => ({ transcript: result[0].transcript, confidence: result[0].confidence }))
        .reduce((acc, curr) => {
          acc.transcript += curr.transcript.toLowerCase();
          acc.confidence = curr.confidence;
          return acc;
        }, { transcript: "", confidence: 0 });

      const { transcript, confidence } = speechResult;
      console.log("Transcript:", transcript);
      console.log("Confidence:", confidence);

      // Extract first name
      if (transcript.includes("name is") || transcript.includes("first name is") || transcript.includes("my name is") || transcript.includes("my first name is") || transcript.includes("i am")) {
        const nameMatch = transcript.match(/(name is|first name is|my name is|my first name is|i am) ([a-z]+)/);
        if (nameMatch) {
          const firstName = nameMatch[2];
          setFormData(prevData => ({ ...prevData, firstName }));
          setConfidenceScores(prevScores => ({ ...prevScores, firstName: confidence }));
        }
      }

      // Extract last name
      if (transcript.includes("last name is") || transcript.includes("my last name is") || transcript.includes("surname is")) {
        const lastNameMatch = transcript.match(/(last name is|my last name is|surname is) ([a-z]+)/);
        if (lastNameMatch) {
          const lastName = lastNameMatch[2];
          setFormData(prevData => ({ ...prevData, lastName }));
          setConfidenceScores(prevScores => ({ ...prevScores, lastName: confidence }));
        }
      }

      // Extract phone number
      if (transcript.includes("phone") || transcript.includes("number") || transcript.includes("contact")) {
        const phoneMatch = transcript.match(/(?:phone|number|contact) ([\d\s]+)/);
        if (phoneMatch) {
          const phone = phoneMatch[1].replace(/\s+/g, '');
          setFormData(prevData => ({ ...prevData, phone }));
          setConfidenceScores(prevScores => ({ ...prevScores, phone: confidence }));
        }
      }

      // Extract policy type
      if (transcript.includes("policy type is") || transcript.includes("policy is")) {
        const policyMatch = transcript.match(/(policy type is|policy is) ([a-z]+)/);
        if (policyMatch) {
          const policyType = policyMatch[2];
          setFormData(prevData => ({ ...prevData, policyType }));
          setConfidenceScores(prevScores => ({ ...prevScores, policyType: confidence }));
        }
      }

      // Extract beneficiary 1
      if (transcript.includes("beneficiary 1 is") || transcript.includes("first beneficiary is")) {
        const beneficiary1Match = transcript.match(/(beneficiary 1 is|first beneficiary is) ([a-z]+)/);
        if (beneficiary1Match) {
          const beneficiary1 = beneficiary1Match[2];
          setFormData(prevData => ({ ...prevData, beneficiary1 }));
          setConfidenceScores(prevScores => ({ ...prevScores, beneficiary1: confidence }));
        }
      }

      // Extract beneficiary 2
      if (transcript.includes("beneficiary 2 is") || transcript.includes("second beneficiary is")) {
        const beneficiary2Match = transcript.match(/(beneficiary 2 is|second beneficiary is) ([a-z]+)/);
        if (beneficiary2Match) {
          const beneficiary2 = beneficiary2Match[2];
          setFormData(prevData => ({ ...prevData, beneficiary2 }));
          setConfidenceScores(prevScores => ({ ...prevScores, beneficiary2: confidence }));
        }
      }

      // Extract comments
      if (transcript.includes("comments") || transcript.includes("additional comments")) {
        const commentsMatch = transcript.match(/(?:comments|additional comments) (.+)/);
        if (commentsMatch) {
          const comments = commentsMatch[1];
          setFormData(prevData => ({ ...prevData, comments }));
          setConfidenceScores(prevScores => ({ ...prevScores, comments: confidence }));
        }
      }
    };

    newRecognition.onresult = handleSpeech;
    setRecognition(newRecognition);
  }, []);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  const renderConfidence = (confidence) => {
    if (confidence !== null) {
      return <span style={{ marginLeft: '10px', color: confidence > 0.7 ? 'green' : 'orange' }}>Confidence: {(confidence * 100).toFixed(2)}%</span>;
    }
    return null;
  };

  return (
    <div className="App">
      <h1>Speech to Form</h1>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          {renderConfidence(confidenceScores.firstName)}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          {renderConfidence(confidenceScores.lastName)}
        </div>
        <div>
          <label>Phone number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {renderConfidence(confidenceScores.phone)}
        </div>
        <div>
          <label>Policy type:</label>
          <select
            name="policyType"
            value={formData.policyType}
            onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
          >
            <option value="">Select a policy</option>
            <option value="life">Life</option>
            <option value="health">Health</option>
            <option value="auto">Auto</option>
          </select>
          {renderConfidence(confidenceScores.policyType)}
        </div>
        <div>
          <label>Beneficiary 1:</label>
          <input
            type="text"
            name="beneficiary1"
            value={formData.beneficiary1}
            onChange={(e) => setFormData({ ...formData, beneficiary1: e.target.value })}
          />
          {renderConfidence(confidenceScores.beneficiary1)}
        </div>
        <div>
          <label>Beneficiary 2:</label>
          <input
            type="text"
            name="beneficiary2"
            value={formData.beneficiary2}
            onChange={(e) => setFormData({ ...formData, beneficiary2: e.target.value })}
          />
          {renderConfidence(confidenceScores.beneficiary2)}
        </div>
        <div>
          <label>Additional comments:</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          />
          {renderConfidence(confidenceScores.comments)}
        </div>
      </form>
    </div>
  );
}

export default App;
