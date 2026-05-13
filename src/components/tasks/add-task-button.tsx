import NormalAddButton from "./normal-add-button";

type AddTaskButtonProps = {
  onPress: () => void;
};

export default function AddTaskButton({ onPress }: AddTaskButtonProps) {
  return <NormalAddButton bottom={30} onPress={onPress} />;
}
