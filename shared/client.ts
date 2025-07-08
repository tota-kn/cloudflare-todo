import type { RouteType } from "../back/dist/types/index.d.ts";
import type { AttachFileToTodoRequestDto, AttachmentResponseDto } from "../back/dist/types/presentation/dto/AttachmentDto.js";
import type { CreateTodoRequestDto, TodoResponseDto, UpdateTodoRequestDto } from "../back/dist/types/presentation/dto/TodoDto.js";


export type ClientType = RouteType;
export type TodoItem = TodoResponseDto;
export type CreateTodoRequest = CreateTodoRequestDto;
export type UpdateTodoRequest = UpdateTodoRequestDto;
export type AttachmentResponse = AttachmentResponseDto;
export type AttachFileToTodoRequest = AttachFileToTodoRequestDto;
