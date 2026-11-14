export {};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      parameters: {
        event_category: string;
        event_label: string;
      },
    ) => void;
  }
}
