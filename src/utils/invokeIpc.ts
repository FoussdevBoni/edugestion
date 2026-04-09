export const invokeIpc = async (channel: string, ...args: any[]) => {
  return await (window as any).electron.ipcRenderer.invoke(channel, ...args);
};