export interface Recipe {
  id: number;
  title: string;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  ingredientsCount: number;
  creatorName: string;
  creationDate: string;
}
