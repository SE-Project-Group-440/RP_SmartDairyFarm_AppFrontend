import { View } from "react-native";
import { CattleDetail } from "../../../../components/heatStress/CattleDetail";
import type { Cattle } from "./CattleListScreen";

export default function CattleProfileScreen({ cattle, onBack, onStatusChange }:{
  cattle: Cattle;
  onBack: ()=>void;
  onStatusChange: (id:number, status:'active'|'inactive')=>void;
}) {
  return (
    <View className="flex-1">
      <CattleDetail cattle={cattle} onBack={onBack} onStatusChange={onStatusChange} />
    </View>
  );
}
