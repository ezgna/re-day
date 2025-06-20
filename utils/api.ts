export const summarizeContent = async (date: string, contents: string[], language: string) => {
  const response = await fetch("https://re-day-api.vercel.app/api/summary", {
    method: "POST",
    body: JSON.stringify({ contents, date, language }),
  });
  const { title, summary } = await response.json();
  return { title, summary };
};
