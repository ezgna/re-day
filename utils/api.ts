  export const summarizeContent = async (contents: string[]) => {
    const response = await fetch("http://192.168.1.76:3000/api/summary", {
      method: "POST",
      body: JSON.stringify({ contents }),
    });
    const { summary } = await response.json();
    return summary
  };