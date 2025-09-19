export class FindUserByEmailUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({email}) {
        return await this.userRepository.getByEmail({email: email});
    }
}