import i18n from "@/utils/i18n";
import { theme } from "@/utils/theme";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Entypo } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable } from "react-native";

interface EditActionSheetProps {
  deleteEntry: () => void;
  editEntry: () => void;
}

export const EditActionSheet: FC<EditActionSheetProps> = ({ deleteEntry, editEntry }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = [`${i18n.t("edit")}`, `${i18n.t("delete")}`, `${i18n.t("cancel")}`];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            editEntry();
            break;

          case destructiveButtonIndex:
            deleteEntry();
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  return (
    <Pressable onPress={onPress}>
      <Entypo name="dots-three-horizontal" size={12} color={theme.colors.secondary} />
    </Pressable>
  );
};
