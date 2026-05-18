export interface SecurityOption {
  id: string;
  title: string;
  icon: string;
  description: string;
  type?: "navigation" | "toggle";
  value?: boolean;
}