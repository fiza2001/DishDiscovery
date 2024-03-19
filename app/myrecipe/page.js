import MyRecipe from "@/Components/MyRecipe";
import { Suspense } from "react";

export default function myrecipe() {
  return (
    <Suspense>
      <MyRecipe />
    </Suspense>
  );
}
