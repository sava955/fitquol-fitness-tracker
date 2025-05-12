export interface ActionButtons {
    label: string;
    action: () => void;
    style?: string;
    disabled?: boolean;
}