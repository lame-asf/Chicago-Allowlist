const WH_URL =
  "https://discord.com/api/webhooks/1484643545922015259/1w34CcTtsa9xnCmjivs4R2p5pxYtbm9Gsswcy6NXyqMXJXFNXdeqOJg-gKp2B36_d1Rs";

module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).end(JSON.stringify({ message: "Método não permitido." }));

  const { nome, discord, idade, personagem, historia, experiencia, motivacao, chatlog } =
    req.body || {};

  if (!nome || !discord || !idade || !personagem || !historia || !experiencia || !motivacao || !chatlog)
    return res.status(400).end(JSON.stringify({ message: "Preencha todos os campos obrigatórios." }));
  if (Number(idade) < 16)
    return res.status(400).end(JSON.stringify({ message: "Você precisa ter pelo menos 16 anos." }));
  if (historia.length < 100)
    return res.status(400).end(JSON.stringify({ message: "A história precisa ter pelo menos 100 caracteres." }));
  if (chatlog.length < 80)
    return res.status(400).end(JSON.stringify({ message: "O chatlog precisa ser mais detalhado." }));

  const embed = {
    title: "🏙️ Nova Candidatura — Allow-List",
    color: 0xf5c500,
    fields: [
      { name: "👤 Nome Real",           value: nome,                       inline: true  },
      { name: "💬 Discord",             value: discord,                    inline: true  },
      { name: "🎂 Idade",               value: String(idade),              inline: true  },
      { name: "🎭 Personagem",          value: personagem,                 inline: false },
      { name: "📖 História",            value: historia.slice(0, 1024),    inline: false },
      { name: "🎮 Experiência com RP",  value: experiencia.slice(0, 1024), inline: false },
      { name: "✍️ Motivação",           value: motivacao.slice(0, 1024),   inline: false },
      { name: "💬 Chatlog da Cena",     value: "```\n" + chatlog.slice(0, 990) + "\n```", inline: false },
    ],
    footer: { text: "Chicago Roleplay — Allow-List System" },
    timestamp: new Date().toISOString(),
  };

  try {
    const discordRes = await fetch(WH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Chicago RP | Allow-List", embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error("Discord error:", discordRes.status, errText);
      return res.status(500).end(JSON.stringify({ message: "Erro ao enviar para o Discord. Código: " + discordRes.status }));
    }

    return res.status(200).end(JSON.stringify({ message: "Candidatura enviada!" }));
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).end(JSON.stringify({ message: "Erro interno: " + err.message }));
  }
};
