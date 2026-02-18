
import { GoogleGenAI, Type } from "@google/genai";
import { Tab, AnalysisResult } from "../types";

const getAIInstance = (apiKey: string) => {
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    throw new Error("Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 키를 입력해주세요.");
  }
  return new GoogleGenAI({ apiKey });
};

export const categorizeTabs = async (tabs: Tab[], apiKey: string, aiModel: string = "gemini-1.5-flash"): Promise<AnalysisResult> => {
  const prompt = `
    다음은 현재 브라우저에 열려 있는 탭 목록입니다. 
    이 탭들을 주제별로 3~5개의 그룹으로 분류해주세요.
    각 그룹에는 적절한 카테고리 이름과 짧은 태그(이모지 포함)를 붙여주세요.
    
    탭 목록:
    ${tabs.map(t => `- [${t.id}] ${t.title} (${t.url})`).join('\n')}

    응답은 반드시 JSON 형식으로 properties에 groups(name, tag, tabIds[])를 포함해야 합니다.
  `;

  if (!apiKey) throw new Error(`${aiModel} 전용 API 키가 설정되지 않았습니다.`);

  try {
    // 1. Google Gemini
    if (aiModel.startsWith('gemini')) {
      const ai = getAIInstance(apiKey);
      const response = await ai.models.generateContent({
        model: aiModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              groups: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    tag: { type: Type.STRING },
                    tabIds: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "tag", "tabIds"]
                }
              }
            },
            required: ["groups"]
          }
        }
      });
      return JSON.parse(response.text) as AnalysisResult;
    }

    // 2. OpenAI GPT
    if (aiModel.startsWith('gpt')) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: aiModel,
          messages: [{ role: 'user', content: prompt + ' Return only raw JSON.' }],
          response_format: { type: 'json_object' }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'OpenAI API 호출 실패');
      return JSON.parse(data.choices[0].message.content) as AnalysisResult;
    }

    // 3. Anthropic Claude
    if (aiModel.startsWith('claude')) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: aiModel,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt + ' Return only raw JSON.' }]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Anthropic API 호출 실패');
      const text = data.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : text) as AnalysisResult;
    }

    throw new Error(`지원하지 않는 모델 엔진입니다: ${aiModel}`);
  } catch (error: any) {
    console.error(`${aiModel} 분석 오류:`, error);

    let userMessage = error.message || "AI 분석 중 오류가 발생했습니다.";

    // API Quota / Rate Limit Error Handling (429)
    if (userMessage.includes("429") || userMessage.includes("RESOURCE_EXHAUSTED") || userMessage.includes("quota")) {
      userMessage = `[${aiModel}] API 할당량을 모두 사용했습니다. 잠시 후(약 1분 뒤) 다시 시도하거나, 설정 페이지에서 다른 AI 엔진(OpenAI 또는 Anthropic)을 선택해 주세요.`;
    } else if (userMessage.includes("fetch") || userMessage.includes("network")) {
      userMessage = "네트워크 연결이 원활하지 않습니다. 인터넷 연결을 확인하거나 프록시/VPN 설정을 점검해 주세요.";
    }

    throw new Error(userMessage);
  }
};
