export class GetUserByIdlUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({userId}) {
        return this.userRepository.getById({userId: userId});
    }
}