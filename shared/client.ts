import type { RouteType } from "../back/src/index.ts";
import type { TodoResponseDto, CreateTodoRequestDto, UpdateTodoRequestDto } from "../back/src/presentation/dto/TodoDto.ts";
import type { AttachmentResponseDto as BackendAttachmentResponseDto, AttachFileToTodoRequestDto } from "../back/src/presentation/dto/AttachmentDto.ts";

export type ClientType = RouteType;
export type TodoItem = TodoResponseDto;
export type CreateTodoRequest = CreateTodoRequestDto;
export type UpdateTodoRequest = UpdateTodoRequestDto;
export type AttachmentResponseDto = BackendAttachmentResponseDto;
export type AttachFileToTodoRequest = AttachFileToTodoRequestDto;
