import { Hono } from 'hono'
import { FileController } from '../controllers/FileController'

export function createFileRoutes(fileController: FileController) {
  const fileRoutes = new Hono<{ Bindings: CloudflareEnv }>()

  fileRoutes.get('/', c => fileController.listFiles(c))

  fileRoutes.post('/:key', c => fileController.uploadFile(c))

  fileRoutes.get('/:key', c => fileController.getFile(c))

  fileRoutes.delete('/:key', c => fileController.deleteFile(c))

  return fileRoutes
}
