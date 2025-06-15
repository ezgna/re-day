export const summarizeContent = async (date: string, contents: string[], language: string) => {
  const response = await fetch("http://192.168.1.76:3000/api/summary", {
    method: "POST",
    body: JSON.stringify({ contents, date, language }),
  });
  const { title, summary } = await response.json();
  return { title, summary };
};
