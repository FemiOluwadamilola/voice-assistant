const router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");

router.get("/", (req, res) => {
  res.status(200).render("index", {
    title: "home page",
  });
});

router.post("/bot", async (req, res) => {
  const { speech } = req.body;
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const checkSpeech = await openai.createModeration({
      input: speech,
    });
    if (checkSpeech.flagged === true) {
      res.status(403).json({
        message: "Hate speech not allowed...",
      });
    } else {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: speech,
          },
        ],
      });
      const bot = completion.data.choices[0].message;
      res.status(200).json({
        bot: bot.role,
        response: bot.content,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong, please try again later",
    });
  }
});
module.exports = router;
