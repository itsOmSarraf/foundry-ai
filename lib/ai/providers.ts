      import {
        customProvider,
        extractReasoningMiddleware,
        wrapLanguageModel,
      } from 'ai';
      import { google } from '@ai-sdk/google';
      import { isTestEnvironment } from '../constants';
      import {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } from './models.test';

      export const myProvider = isTestEnvironment
        ? customProvider({
            languageModels: {
              'chat-model': chatModel,
              'chat-model-reasoning': reasoningModel,
              'title-model': titleModel,
              'artifact-model': artifactModel,
            },
          })
        : customProvider({
            languageModels: {
              'chat-model': google('gemini-2.0-flash-001', {
                useSearchGrounding: true,
                dynamicRetrievalConfig: {
                  mode: 'MODE_DYNAMIC',
                  dynamicThreshold: 0.8,
                },
                safetySettings: [
                  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                ],
              }),
              'chat-model-reasoning': wrapLanguageModel({
                model: google('gemini-2.0-flash-001', {
                  useSearchGrounding: true,
                  dynamicRetrievalConfig: {
                    mode: 'MODE_DYNAMIC',
                    dynamicThreshold: 0.8,
                  },
                  safetySettings: [
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                  ],
                }),
                middleware: extractReasoningMiddleware({ tagName: 'think' }),
              }),
              'title-model': google('gemini-2.0-flash-001'),
              'artifact-model': google('gemini-2.0-flash-001'),
              'image-model': google('gemini-2.0-flash-exp', {
                useSearchGrounding: true,
              }),
            },
            // imageModels: {
            //   'small-model': google('gemini-1.5-flash'),
            // },
          });
