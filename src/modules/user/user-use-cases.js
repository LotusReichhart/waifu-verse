import {GetUserByIdlUseCase} from './profile/domain/use-cases/index.js';

export function createUserUseCases({userRepository}) {
    return {
        getUseById: new GetUserByIdlUseCase(userRepository),
    }
}