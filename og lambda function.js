const https = require("https");

exports.handler = async (event) => {
  const { text } = JSON.parse(event.body);

  const prompt = `
Extract the following features from the text:
- Bachelor’s University
- Bachelor’s CGPA
- Bachelor’s Year
- Master’s University
- Master’s CGPA
- GRE Score
- IELTS Score
- TOEFL Score
- Awards
- Research Interests
- Latest Papers
Provide the output in JSON format.

Text:
${text}
    `;

  const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let response = "";
      res.on("data", (chunk) => {
        response += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: response,
        });
      });
    });

    req.on("error", (error) => {
      reject({
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      });
    });

    req.write(data);
    req.end();
  });
};
