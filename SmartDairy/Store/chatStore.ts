import { create } from "zustand";

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
  audioUri?: string;
};

type ChatState = {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  clearMessages: (welcomeAudioUrl: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messagesOrUpdater) =>
    set((state) => ({
      messages:
        typeof messagesOrUpdater === "function"
          ? messagesOrUpdater(state.messages)
          : messagesOrUpdater,
    })),
  clearMessages: (welcomeAudioUrl) =>
    set({
      messages: [
        {
          id: 1,
          text: "ආයුබෝවන්! මම ඔබගේ කිරි ගොවිතැන් උපදේශකයා. ඔබට ප්‍රශ්න අසන්න පුළුවන්",
          isUser: false,
          audioUri: welcomeAudioUrl,
        },
      ],
    }),
}));
