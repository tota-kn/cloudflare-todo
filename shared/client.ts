import type { RouteType } from "../back/src/index.ts";
import type { TodoResponseDto, CreateTodoRequestDto, UpdateTodoRequestDto } from "../back/src/presentation/dto/TodoDto.ts";

export type ClientType = RouteType;

// Re-export commonly used types for frontend consumption
export type TodoItem = TodoResponseDto;
export type CreateTodoRequest = CreateTodoRequestDto;
export type UpdateTodoRequest = UpdateTodoRequestDto;
