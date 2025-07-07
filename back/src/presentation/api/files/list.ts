import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { FileDtoMapper } from '../../dto/FileDto'

export function createListFilesApi(dependencies: Dependencies) {
  const listFilesUseCase = dependencies.getListFilesUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .get('', async (c) => {
      try {
        const files = await listFilesUseCase.execute()
        return c.json({
          files: FileDtoMapper.toResponseDtoList(files),
        })
      }
      catch (error) {
        console.error('Failed to list files:', error)
        return c.json({ error: 'Failed to list files' }, 500)
      }
    })
}
