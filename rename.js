((proxiesRaw) => {
  const proxies = Array.isArray(proxiesRaw) ? proxiesRaw : [];
  const airportPrefix = "晏";
  const keepKeywords = ["GPT", "NF", "IPLC", "家宽", "Game"];
  const flagMap = {
    香港: "🇭🇰", 台湾: "🇨🇳", 日本: "🇯🇵", 韩国: "🇰🇷", 新加坡: "🇸🇬",
    美国: "🇺🇸", 英国: "🇬🇧", 德国: "🇩🇪", 法国: "🇫🇷", 澳大利亚: "🇦🇺"
  };
  const regionMap = [
    { pattern: /香港|HK|Hong/i, name: "香港" },
    { pattern: /台湾|TW/i, name: "台湾" },
    { pattern: /日本|JP|Tokyo|Osaka/i, name: "日本" },
    { pattern: /韩国|KR|Korea|Seoul/i, name: "韩国" },
    { pattern: /新加坡|SG/i, name: "新加坡" },
    { pattern: /美国|US|United States|Los Angeles|Silicon/i, name: "美国" },
    { pattern: /英国|UK|GB|London/i, name: "英国" },
    { pattern: /德国|DE|Frankfurt/i, name: "德国" },
    { pattern: /法国|FR/i, name: "法国" },
    { pattern: /澳大利亚|AU/i, name: "澳大利亚" }
  ];

  const safeName = (s, i) => typeof s === 'string' && s.trim() ? s : `Node-${i}-${Math.random().toString(36).slice(2, 6)}`;

  function extractRegion(name) {
    for (const r of regionMap) {
      if (r.pattern.test(name)) return r.name;
    }
    return "未知";
  }

  function extractMultiplier(name) {
    const match = name.match(/((?!1)(\d+(\.\d+)?))([xX×倍ˣ²ˣ³ˣ⁴ˣ⁵ˣ⁶ˣ⁷ˣ⁸ˣ⁹ˣ¹⁰]*)/);
    return match ? `${match[1]}x` : null;
  }

  function extractTag(name) {
    return keepKeywords.filter(k => name.includes(k)).join("+") || "";
  }

  let processed = proxies.map((p, i) => {
    try {
      const rawName = safeName(p.name, i);
      const region = extractRegion(rawName);
      const port = p.port || "0000";
      const flag = flagMap[region] || "🏳️";
      const multiplier = extractMultiplier(rawName);
      const tag = extractTag(rawName);
      const parts = [airportPrefix, flag, region, port, tag, multiplier].filter(Boolean);
      p.name = parts.join(" - ");
      return p;
    } catch {
      p.name = `Node-${i}`;
      return p;
    }
  });

  processed = processed.filter(p => /(\d+(\.\d+)?)(x|倍|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ⁶)/i.test(p.name));
  const highMult = processed.filter(p => /2x|3x|4x|倍|ˣ²|ˣ³/.test(p.name));
  const normal = processed.filter(p => !highMult.includes(p));
  return [...highMult, ...normal];
})(arguments[0]);
