import { Configuration, OpenAIApi } from "openai";
import { database as db } from "./database";
import { SmartSubtask } from "./appStore";
import { nanoid } from "nanoid";

export const getSmartResponse = async (input: string, requestId: string) => {
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
          content: `You are a helpful assistant that calculates the probability that the task given by the user can be done within 30 minutes. The target audience are undergraduate computer science students. The probability score X is a number between 0 and 100. If the score X is below 100, split the task into subtasks with names S that also take around 30 minutes. The lower the score is, the more subtasks with names S are needed. Be generous in giving subtask suggestions. Exponentially increase the number of subtasks with decreasing probability score X. Also calculate the probability score XS that the subtask can be done within 30 minutes. If the average probability score XS of the subtasks is below 90, give even more subtasks. If you have provided subtasks for the previous task T with the same name, alwasy give new subtasks. I am going to provide a template for your output. Answer only with the json and no further text. The user gives you the name of the task and nothing more. T is my placeholder for the name of the task given by the user. X is my placeholder for the probability score of the task T. S is my placeholder for a name of a subtask suggested by you. XS is my placeholder for the probability score of the subtask S. Please preserve the formatting and overall template that i provide. If you don't suggest any subtasks, set an empty array as subtasks. This is the template for your output. The format must be a json: {"name":  task T ,"probability":  X ,"subtasks": [{"name": S, "probability":  XS },...]}`,
        },
        { role: "user", content: input },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });
    const response = completion.data.choices[0].message.content;

    // parse response and set id
    const data = JSON.parse(response);
    console.log("index.ts) Data: ", data);
    const parentTaskId = `smartTask-${nanoid()}`;

    // prepare smart subtask data
    const smartSubtasks = data.subtasks.map((subtask: SmartSubtask) => ({
      id: `smartSubtask-${nanoid()}`,
      createdDate: new Date().toISOString(),
      name: subtask.name,
      probability: subtask.probability,
      parentTaskId: parentTaskId,
    }));

    //  prepare smart task data
    const smartTask = {
      requestId: requestId,
      id: parentTaskId,
      createdDate: new Date().toISOString(),
      name: data.name,
      probability: data.probability,
      subtasks: smartSubtasks,
    };

    // add the smartresponse to the database
    db.addSmartResponse(smartTask, smartSubtasks);

    // return the smartresponse to the frontend to add to subtasks
    return smartTask;
  } catch (error) {
    if (error.response) {
      console.log("index.ts) ", error.response.status);
      console.log("index.ts) ", error.response.data);
    } else {
      console.log("index.ts) ", error.message);
    }
  }
};
