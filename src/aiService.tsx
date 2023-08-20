import { Configuration, OpenAIApi } from "openai";
import { database as db } from "./database";

export const getSmartResponse = async ( input: string) => {
    console.log(input);
    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
  
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that calculates the probability that the task given by the user can be done within 30 minutes. The probability score X is a number between 0 and 100. If the score X is below 80, split the task into subtasks with names S that take around 30 minutes. The lower the score is, the more subtasks with names S are needed. I am going to provide a template for your output. Answer only with the json and no further text. The user gives you the name of the task and nothing more. X is my placeholder for the probability score. S is my placeholder for a name of a subtask suggested by you. T is my placeholder fo the name of the task given by the user. Please preserve the formatting and overall template that i provide. If you don't suggest any subtasks, set an empty array as subtasks. This is the template for your output. The format ismust be a json: {"name":  task T ,"probability":  X ,"subtasks": [{"name": S },...]}`,
          },
          { role: "user", content: input },
        ],
        temperature: 0.4,
        max_tokens: 200,
      });
      const response = completion.data.choices[0].message.content;
      const data = JSON.parse(response);
      console.log("index.ts) Data: ", data);
      db.addSmartResponse(data);
      return data
    } catch (error) {
      if (error.response) {
        console.log("index.ts) ", error.response.status);
        console.log("index.ts) ", error.response.data);
      } else {
        console.log("index.ts) ", error.message);
      }
    }
};
