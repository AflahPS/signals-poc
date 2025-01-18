import express, { Router } from 'express';
import { validate } from '../../modules/utils/validate';
import { auth } from '../../modules/auth';
import { postController, postValidation } from '../../modules/post';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(postValidation.createPost), postController.createPost)
  .get(auth(), validate(postValidation.getPosts), postController.getPosts);

router
  .route('/:postId')
  .get(auth(), validate(postValidation.getPost), postController.getPost)
  .patch(auth(), validate(postValidation.updatePost), postController.updatePost)
  .delete(auth(), validate(postValidation.deletePost), postController.deletePost);

export default router;
