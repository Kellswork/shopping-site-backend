import {
  createCategory,
  getAllCategories,
  patchCategory,
  deleteCategory,
} from './models/index.model';
import { formatResponse } from '../../helpers/baseHelper';

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await createCategory({ name: name.toLowerCase() });

    const data = {
      id: category.id,
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
    return formatResponse(
      res,
      { message: 'Category created successfully' },
      201,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not create category, please try again later' },
      500,
    );
  }
};

export const fetchAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    return formatResponse(
      res,
      { message: 'Categories fetched successfully' },
      200,
      { categories },
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Error getting categories, please try again later' },
      500,
    );
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await patchCategory(id, name);
    return formatResponse(
      res,
      { message: 'Category updated successfully' },
      200,
      { category: category[0] },
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Error getting categories, please try again later' },
      500,
    );
  }
};

export const deleteACategory = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    return formatResponse(res, { message: 'Category has been deleted' }, 204);
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Error getting categories, please try again later' },
      500,
    );
  }
};
