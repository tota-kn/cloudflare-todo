import { Hono } from 'hono'
import { FileController } from '../controllers/FileController'

export function createFileRoutes(fileController: FileController) {
  return new Hono<{ Bindings: CloudflareEnv }>()
    .get('', c => fileController.listFiles(c))
    .post(':key', c => fileController.uploadFile(c))
    .get(':key', c => fileController.getFile(c))
    .delete(':key', c => fileController.deleteFile(c))
}
