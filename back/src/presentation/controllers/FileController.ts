import { Context } from 'hono'
import { DeleteFileUseCase } from '../../application/usecases/DeleteFileUseCase'
import { GetFileUseCase } from '../../application/usecases/GetFileUseCase'
import { ListFilesUseCase } from '../../application/usecases/ListFilesUseCase'
import { UploadFileUseCase } from '../../application/usecases/UploadFileUseCase'
import { FileDtoMapper } from '../dto/FileDto'

export class FileController {
  constructor(
    private readonly listFilesUseCase: ListFilesUseCase,
    private readonly getFileUseCase: GetFileUseCase,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {}

  async listFiles(c: Context) {
    try {
      const files = await this.listFilesUseCase.execute()
      return c.json({
        files: FileDtoMapper.toResponseDtoList(files),
      })
    }
    catch (error) {
      console.error('Failed to list files:', error)
      return c.json({ error: 'Failed to list files' }, 500)
    }
  }

  async getFile(c: Context) {
    try {
      const key = c.req.param('key')
      const object = await this.getFileUseCase.execute(key)

      if (!object) {
        return c.json({ error: 'File not found' }, 404)
      }

      const headers = new Headers()
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)

      return new Response(object.body, { headers })
    }
    catch (error) {
      console.error('Failed to get file:', error)
      return c.json({ error: 'Failed to get file' }, 500)
    }
  }

  async uploadFile(c: Context) {
    try {
      const key = c.req.param('key')
      const body = await c.req.raw.arrayBuffer()

      await this.uploadFileUseCase.execute({ key, content: body })

      return c.json({ message: `File ${key} uploaded successfully` })
    }
    catch (error) {
      console.error('Failed to upload file:', error)
      return c.json({ error: 'Failed to upload file' }, 500)
    }
  }

  async deleteFile(c: Context) {
    try {
      const key = c.req.param('key')
      const deleted = await this.deleteFileUseCase.execute(key)

      if (!deleted) {
        return c.json({ error: 'File not found' }, 404)
      }

      return c.json({ message: `File ${key} deleted successfully` })
    }
    catch (error) {
      console.error('Failed to delete file:', error)
      return c.json({ error: 'Failed to delete file' }, 500)
    }
  }
}
