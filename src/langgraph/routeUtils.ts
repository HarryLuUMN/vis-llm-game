import { StateGraph, Annotation, START, END } from "@langchain/langgraph/web";
import { z } from "zod";
import { initializeLLM } from "./chainingUtils";
import { autoControlAgent, transmitReport } from "../game/utils/controlUtils";
import { Agent } from "openai/_shims/index.mjs";
import { EventBus } from "../game/EventBus";
import { baseballPath, createReport, GeneralStateAnnotation, kidneyPath } from "./agents";
import { updateStateIcons } from "../game/utils/sceneUtils";
import { cleanUpD3Code, generateChartImage } from "./visualizationGenerate";
import { generateImage } from "./dalleUtils";
import { d3Script } from "./const";
import { marked } from "marked";
import { baseball, kidney } from "../game/assets/sprites";


// const RouteAnnotation = Annotation.Root({
//     input: Annotation<string>,
//     decision: Annotation<string>,
//     output: Annotation<string>,
// });


const ucbPath: string = "./data/simulated_ucb.csv"
const covidPath: string = "./data/simulated_covid.csv"

const routeSchema = z.object({
    step: z.enum(["visualization", "illustration"]).describe(
      "The next step in the routing process"
    ),
});

const sampleSystemPrompts = [
    {
        role: "visualization", 
        prompt: "write a short report(<100words) about weather in New York City"
    },
    {
        role: "illustration", 
        prompt: "write a short report(<100words) about social trends among teenagers in the US"
    },
];


async function testBranchWork(
    scene: any,
    command: string, 
    state: any, 
    content: string, 
    agent: any,
    scoreText: Phaser.GameObjects.Text,
){
    let datasetPath = baseballPath;

    console.log("state route", state);

        if(!state.votingToChaining) {
            if(scene.registry.get('currentDataset')==='kidney'){
                datasetPath = kidneyPath;
            }
        }

        const res = await fetch(datasetPath);
        const csvRaw = await res.text();
        console.log("csvRaw", csvRaw);

    command = "visualization";
    console.log("command", command);
    
    if(command === "visualization"){
        console.log("entered visualization branch")

        const chartData = await generateChartImage(csvRaw, agent, state);

        const svgId1 = chartData.chartId;
        const svgId2 = chartData.chartId;

        const d3Code = chartData.d3Code;

        // EventBus.emit("final-report", { report: content, department: "routing" });
        const URL = await generateImage(`please give me an image based on the following describ or coonect with it: ${content}`);
        console.log("URL", URL)
        console.log("d3code", d3Code)
        const markdownFromLLM = await createHighlighter(content) as any;
      // let dynamicTitle = "Generated Report Summary";
      // let markdownCleaned = markdownFromLLM;

      // const markdownTitleLine = markdownFromLLM
      //   .split('\n')
      //   .find((line: string) =>
      //     line.trim().startsWith('#') && line.toLowerCase().includes('title:')
      //   );


      // if (markdownTitleLine) {
      //   dynamicTitle = markdownTitleLine.replace(/^#+\s*Title:\s*/i, '').trim();
      //   markdownCleaned = markdownFromLLM.replace(markdownTitleLine, '');
      // } else {
      //   const h1Match = markdownFromLLM.match(/<h1[^>]*>(.*?)<\/h1>/i);
      //   if (h1Match) {
      //     dynamicTitle = h1Match[1].replace(/^Title:\s*/i, '').trim();
      //     markdownCleaned = markdownFromLLM.replace(h1Match[0], '');
      //   }
      // }



      // // let dynamicIntro = "Generated Report Intro";

      // // 提取 ## Intro: 段落（直到下一个 ## 或 # 或结尾）
      // const introRegex = /##\s*Intro:(.*?)(?=\n#{1,2}\s|\n$)/is;
      // const introMatch = markdownCleaned.match(introRegex);

      // if (introMatch) {
      //   dynamicIntro = introMatch[1].trim(); // 去掉前缀并保留内容
      //   markdownCleaned = markdownCleaned.replace(introMatch[0], ''); // 从正文中移除 Intro 段落
      // }

      // const highlightedText = marked.parse(markdownCleaned);





      // let dynamicIntro = "Generated Report Intro";

      // const markdownIntroLine = markdownCleaned
      //   .split('\n')
      //   .find((line: string) =>
      //     line.trim().startsWith('##') && line.toLowerCase().includes('Intro:')
      //   );


      // if (markdownIntroLine) {
      //   dynamicTitle = markdownIntroLine.replace(/^##+\s*Intro:\s*/i, '').trim();
      //   markdownCleaned = markdownFromLLM.replace(markdownIntroLine, '');
      // } else {
      //   const h2Match = markdownFromLLM.match(/<h2[^>]*>(.*?)<\/21>/i);
      //   if (h2Match) {
      //     dynamicIntro = h2Match[1].replace(/^:\s*/i, '').trim();
      //     markdownCleaned = markdownFromLLM.replace(h2Match[0], '');
      //   }
      // }

      // const highlightedText = marked.parse(markdownCleaned);

      let dynamicTitle = "Generated Report Summary";
      let dynamicIntro = "Generated Report Intro";
      let contentWithoutHeaders = markdownFromLLM;
      
      // 1. Extract and remove titles
      const titleMatch = contentWithoutHeaders.match(/^#\s*Title:\s*(.+)$/im);
      if (titleMatch) {
        dynamicTitle = titleMatch[1].trim();
        contentWithoutHeaders = contentWithoutHeaders.replace(titleMatch[0], '');
      }
      
      // 2. Extract and remove Intro
      const introMatch = contentWithoutHeaders.match(/^##\s*Intro:\s*(.+)$/im);
      if (introMatch) {
        dynamicIntro = introMatch[1].trim();
        contentWithoutHeaders = contentWithoutHeaders.replace(introMatch[0], '');
      }
      
      // 3. Final processing (at this point contentWithoutHeaders no longer contains Title and Intro)
      const highlightedText = marked.parse(contentWithoutHeaders.trim());



      





const style = `
<style>
  .newspaper {
    font-family: "Georgia", serif;
    background-color: #f9f6ef;
    color: #000;
    padding: 40px;
    max-width: 960px;
    margin: 20px auto;
    border-radius: 12px;
    box-shadow: 0 0 12px rgba(0,0,0,0.1);
  }

  .newspaper-title {
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0;
    text-transform: uppercase;
  }

  .authors {
    font-size: 14px;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 20px;
    font-style: italic;
  }

  .headline {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .intro-text {
    font-size: 16px;
    line-height: 1.6;
    margin: 20px 0 30px 0;
    text-align: justify;
  }

  .newspaper-body {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
  }

  .article-text {
    flex: 1;
    font-size: 16px;
    line-height: 1.6;
    min-width: 350px;
  }

  .article-graphic {
    flex: 1;
    max-width: 40%;
    text-align: center;
  }

  .article-graphic img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    display: block;
    margin: 50px auto 20px auto;
  }

  .vis-above {
    width: 100%;
    height: 260px;
    border-radius: 8px;
    margin-top: 80px;
    margin-bottom: 20px;
  }

  .visualization-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    margin: 30px 0;
  }

  .vis-box {
    flex: 1 1 40%;
    height: auto;
    width: 100%;
    min-width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 6px;
    background-color: #f9f6ef;
  }

  .comment-section {
    margin-top: 30px;
  }
  .comment-section h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .comment-section ul {
    padding-left: 20px;
  }
  .comment-section li {
    margin-bottom: 5px;
  }
</style>

`;

const comments = await extractTSArray(await createVisualizationJudge(d3Code));
const writingComments = await extractTSArray(await createWritingJudge(state.chainingToRouting));

let commentsHTML = "";

if (comments?.length > 0) {
  commentsHTML += `
    <div class="comment-section">
      <h3>Comments on Visualization</h3>
      <ul>
        ${comments.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
  `;
}

if (writingComments?.length > 1) {
  commentsHTML += `
    <div class="comment-section">
      <h3>Comments on Writing</h3>
      <ul>
        ${writingComments.slice(1).map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
  `;
  scoreText.setText(writingComments[0]);
}

const body = `
  <div class="newspaper">
    <h1 class="newspaper-title">The Agentopia Times</h1>
    <p class="authors">Written by Professional LLM Journalists</p>
    <hr />
    <h2 class="headline">${dynamicTitle}</h2>
    <hr />

  <div class="newspaper-body">
    <div class="article-text">
      ${highlightedText}
    </div>
    <div class="article-graphic">
      <div id="test-chart" class="vis-above"></div>
    </div>
  </div>

  <h3 style="text-align: center;">Visualization I</h3>
  <div class="visualization-row">
    <div id="test-chart1" class="vis-box"></div>
    <div id="test-chart2" class="vis-box"></div>
  </div>

  <hr style="margin: 30px 0;" />
  ${commentsHTML}
</div>

`;

let reportMessage = `${style}${body}`;

// const comments = await extractTSArray(await createVisualizationJudge(d3Code));
// console.log("comments from routes", comments, d3Code);

// if (comments && comments.length > 0) {
//   reportMessage += `
//     <div class="comment-section">
//       <h3>Comments on Visualization</h3>
//       <ul>
//         ${comments.map(c => `<li>${c}</li>`).join('')}
//       </ul>
//     </div>
//   `;
// }

// console.log("reportMessage before stringnify", reportMessage);

// // === Comments Section - Writing ===
// const writingComments = await extractTSArray(await createWritingJudge(state.chainingToRouting));

// if (writingComments && writingComments.length > 1) {
//   reportMessage += `
//     <div class="comment-section">
//       <h3>Comments on Writing</h3>
//       <ul>
//         ${writingComments.slice(1).map(c => `<li>${c}</li>`).join('')}
//       </ul>
//     </div>
//   `;
//   scoreText.setText(writingComments[0]);
// }

// console.log("reportMessage after stringnify", reportMessage);



        // Scene.scoreText = writingComments[0];
        

        
    

        EventBus.emit("final-report", { report: reportMessage, department: "routing" });
    }else{
        console.log("entered illustration branch")
        const URL = await generateImage("please give me an image of a man");
        console.log("URL", URL)
        
        // const arry = `${msg.content}\n\n<img src="${URL}" style="max-width: 80%; height: auto; border-radius: 8px; margin: 10px auto; display: block;" />`;
        
        const reportMessage = `${content}
            \n\n<img src="${URL}" style="max-width: 80%; height: auto; border-radius: 8px; margin: 10px auto; display: block;" />
        `;
        
        EventBus.emit("final-report", { report: reportMessage, department: "routing" });
    }

    return content;
}


async function createHighlighter(message: string) {
    const llm = initializeLLM();
    const systemMssg: string = `
        You are a text highlighter expert.
        Don't remove or modify any html tags in the message.
        Highlight the biased statements in the writing portion(all texts above Visualization I) of the text.
        For example: 

        Message: xxxx, aaaa, bbb. 
        If xxxx is biased, highlight it.
        Then, the output is: 
        <mark>xxxx</mark>, aaaa, bbb. 

        Dont change any other texts in the message.

        ${message}

        return the original message with highlighted texts, 
        but don't change any other texts in the message.
    `;


    console.log("message before highlighter", message)
    const comment = await llm.invoke(systemMssg);
    console.log("message after highligher: ", comment.content);

    console.log("comments from routes llm: ", comment.content);

    return comment.content;
}

async function extractTSArray(raw: any): Promise<string[]> {
    //const trimmed = raw.map((str) => str.trim());
    const clean = raw.replace(/^```typescript\s*|```$/g, "");
    return JSON.parse(clean);
  }
  

export function createLeaf(
    agent: any,
    scene: any,
    tilemap: any,
    destination: any,
    systemPrompt: string = "",
    zones: any,
    scoreText: Phaser.GameObjects.Text
){
    return async function leaf(state: typeof GeneralStateAnnotation.State) {
        // store the original position
        const originalAgentX = agent.x;
        const originalAgentY = agent.y;

        // move the agent to the destination
        console.log("destination from leaf: ", destination);
        
        testBranchWork(
            scene, 
            state.routeDecision, 
            state, 
            state.chainingToRouting, 
            agent, 
            scoreText
        );

        // await updateStateIcons(zones, "mail");

        await autoControlAgent(scene, agent, tilemap, 767, 330, "Send report to final location"); //ERROR
        // create the report from routing graph
        const report = await createReport(scene, "routing", 767, 345);
        // transmit the report to the final location
        await transmitReport(scene, report, destination.x, destination.y);
        // move the agent back to the original position
        await autoControlAgent(scene, agent, tilemap, originalAgentX, originalAgentY, "Returned");

        // await updateStateIcons(zones, "idle");

        return { routeOutput: state.chainingToRouting };
    };
}


export async function createVisualizationJudge(message: string) {
    const llm = initializeLLM();
    console.log("message before vis judge", message)
    const systemMssg: string = `
        You are a visualization grammar expert.

Your task is to evaluate a Vega-Lite specification and provide constructive feedback about its quality and correctness. Consider whether the visualization uses appropriate encodings, mark types, and transformations to represent the intended data meaningfully and clearly.

Follow this reasoning process:
1. Examine the Vega-Lite specification carefully.
2. Identify issues such as:
   - Missing or misleading encodings (e.g., using nominal on a quantitative field).
   - Ineffective mark choices (e.g., using bar when line is more suitable).
   - Redundant or invalid transformations.
   - Poor use of scale, axis, or color channels.
   - Incompatibility with common visualization best practices.
3. Note any good practices or well-designed elements.
4. Do **not** check for syntax errors—assume the spec is valid JSON and compiles.

        Now evaluate the following vega-lite code:

        ${message}

        Return your output as a TypeScript-compatible array of strings (string[]). Each element must be a single-sentence observation or judgment (e.g., "This uses a force layout, which is not supported in Vega-Lite.").

        Do not include any additional text—just the array of strings.

        Example Output: 
        [
            "aaaaaaaaaaaaaaaaaaa",
            "bbbbbbbbbbbbbbbbbbb",
            "ccccccccccccccccccc"
        ]
    `;

    const comment = await llm.invoke(systemMssg);

    console.log("comments from routes llm: ", comment.content);

    console.log("message after vis judge", comment.content)

    try {
        // Try parsing response as a JSON array
        return comment.content;
    } catch (e) {
        console.error("Failed to parse comment as string[]:", e);
        return [`Error: LLM response is not a valid string[]: ${comment.content}`];
    }
}

export async function createWritingJudge(message: string) {
    const llm = initializeLLM();
    console.log("message before writing judge", message)
    const systemMssg: string = `
        You are a bias detection expert.
        Carefully evaluate the following text and identify any potential biases or misleading statements.
        Your task is to provide a list of potential biases or misleading statements in the text.

        ${message}

        You can use the answers below for refeerences:
        1. BaseBall Answer: 
        This phenomenon occurs due to unequal sample sizes across subgroups. David Justice had a higher batting average than Derek Jeter in both 1995 and 1996. However, Jeter had significantly more at-bats in the season when his performance was strongest (1996), while Justice had more at-bats in the season with a lower average (1995). As a result, when the data is aggregated, Jeter's overall average surpasses Justice’s, illustrating how subgroup trends can reverse in the combined data.

        2. Kidney Answer:
        This reversal arises from differences in subgroup composition. Treatment A showed higher success rates than Treatment B for both small and large kidney stones. However, Treatment A was administered more frequently to patients with large stones, which are harder to treat, while Treatment B was more common among patients with small stones. When the data is combined without accounting for stone size, the overall success rate of Treatment B appears higher, even though it was less effective in every subgroup.

        Also, give a score from 1 to 10 for the writing quality, where 1 is the worst and 10 is the best.
        The score should be the first element in the output array, formatted as "Score: X/10".

        Return your output as a TypeScript-compatible array of strings (string[]). Each element must be a single-sentence observation or judgment (e.g., "This uses a force layout, which is not supported in Vega-Lite.").

        Do not include any additional text—just the array of strings.
        Do not highlight any texts in the "Comments on Writing" or "Comments on Visualization" sections.

        Example Output: 
        [
            "Score: 9/10",
            "The data source can be specified in Vega-Lite using a similar dataset.",
            "The chart dimensions and margins can be set using padding and width/height properties in Vega-Lite.",
            "Filtering the data to exclude null values is supported through the filter transformation in Vega-Lite."
        ]
    `;

    const comment = await llm.invoke(systemMssg);

    console.log("comments from routes llm: ", comment.content);

    console.log("message after writing judge", comment.content)

    try {
        // Try parsing response as a JSON array
        return comment.content;
    } catch (e) {
        console.error("Failed to parse comment as string[]:", e);
        return [`Error: LLM response is not a valid string[]: ${comment.content}`];
    }
}

// we also need input locations for agents on the branches
export function createRouter(
    scene: any, 
    tilemap: any, 
    routeAgent: Agent, 
    agentsOnBranches: any[],
    zones: any
){
    return async function router(state: typeof GeneralStateAnnotation.State) {
        const llm = initializeLLM();
        const routeLLM = llm.withStructuredOutput(routeSchema);

        const originalAgentX = routeAgent.x;
        const originalAgentY = routeAgent.y;

        console.log("checking for data", state)

        // await updateStateIcons(zones, "work");
        

        const decision = await routeLLM.invoke([
            {
              role: "system",
              content: "Route the input to visualization or illustration based on the user's request."
            },
            {
              role: "user",
              content: state.chainingToRouting
            },
          ]);

          console.log("router decision: ", decision.step);

          // find agent on the branch
            const agent = agentsOnBranches.find((agent) => agent.branchName === decision.step);

        // send the data to the next agent
        await autoControlAgent(scene, routeAgent, tilemap, agent.agent.x, agent.agent.y, "Send report to final location");

        
        // agent back to original location
        await autoControlAgent(scene, routeAgent, tilemap, originalAgentX, originalAgentY, "Returned");

        
          return { routeDecision: decision.step };        
    };
}

export function routeDecision(state: typeof GeneralStateAnnotation.State){
    if (state.routeDecision === "visualization"){
        return "visualization";
    }
    else if (state.routeDecision === "illustration"){
        return "illustration";
    }
}

export function constructRouteGraph(
    agents: Agent[],
    scene: any,
    tilemap: any,
    destination: any,
    zones: any
){
    const routeGraph = new StateGraph(GeneralStateAnnotation);

    let startNode = START;

    let remainAgents: any[] = [];
    
    // add nodes
    for (let i = 0; i < agents.length; i++){
        if(i < 2){
            routeGraph.addNode(
                sampleSystemPrompts[i].role, 
                createLeaf(agents[i], scene, tilemap, destination, sampleSystemPrompts[i].prompt, zones, scene.creditsText)
            );
            remainAgents.push({agent: agents[i], branchName: sampleSystemPrompts[i].role});
        }
    }

    routeGraph.addNode("router", createRouter(scene, tilemap, agents[2], remainAgents, zones) as any);
    routeGraph.addEdge(startNode as any, "router" as any);
    
    // add conditional edge
    routeGraph
        .addConditionalEdges(
            "router" as any, 
            routeDecision as any, 
            ["visualization", "illustration"] as any
        );

    // add edges
    for(let i = 0; i < sampleSystemPrompts.length; i++){
        routeGraph.addEdge(sampleSystemPrompts[i].role as any, END);
    }

    return routeGraph.compile();
}

export const testingPrompts = [
    "Give me the latest weather update for New York City.",
    "Tell me about the latest social trends among teenagers in the US.",
];

