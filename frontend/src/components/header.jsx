import React from "react";

export const Header = () => {
  return (
    <div>
      <header class="flex items-center px-4 py-2 bg-blue-100">
        <img
          src="https://photos.angel.co/startups/i/5466111-be93a963e10c000285eed4b0a1de5b45-medium_jpg.jpg?buster=1632396499"
          width="50"
          alt="Hopstack Logo"
        />
        <strong class="mx-auto">Hopstack X Nutritionix Calorie Counter</strong>
      </header>
    </div>
  );
};
