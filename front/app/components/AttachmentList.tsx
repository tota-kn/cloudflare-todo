import { useAttachments, useDeleteAttachment } from '~/hooks/useTodos';
import type { AttachmentResponseDto } from '../../../shared/client';

interface AttachmentListProps {
  todoId: string;
}

function AttachmentItem({ attachment, onDelete }: { attachment: AttachmentResponseDto; onDelete: (id: string) => void }) {
  const deleteMutation = useDeleteAttachment();

  const handleDelete = async () => {
    if (confirm('この添付ファイルを削除しますか？')) {
      try {
        await deleteMutation.mutateAsync({ 
          todoId: attachment.id, 
          attachmentId: attachment.id 
        });
        onDelete(attachment.id);
      } catch (error) {
        console.error('Failed to delete attachment:', error);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (contentType === 'application/pdf') {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          {getFileIcon(attachment.contentType          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {attachment.originalFilename}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(attachment.fileSize)} • {new Date(attachment.createdAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <a
          href={`/api/v1/todos/${attachment.id}/attachments/${attachment.id}/download`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          ダウンロード
        </a>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={`text-red-600 hover:text-red-700 text-sm font-medium ${
            deleteMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {deleteMutation.isPending ? '削除中...' : '削除'}
        </button>
      </div>
    </div>
  );
}

export function AttachmentList({ todoId }: AttachmentListProps) {
  const { data: attachments, isLoading, error, refetch } = useAttachments(todoId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">添付ファイルの読み込みに失敗しました。</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
        >
          再試行
        </button>
      </div>
    );
  }

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm text-gray-500">添付ファイルはありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          onDelete={() => refetch()}
        />
      ))}
    </div>
  );
}