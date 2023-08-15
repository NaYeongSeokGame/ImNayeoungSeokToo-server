import ModelQuiz from '@/models/quiz/quiz';
import ModelQuizPreset from '@/models/quizPreset/quizPreset';
import S3StorageModule from '@/modules/s3Storage.module';

class ServiceQuiz {
  /**
   * 새로운 퀴즈를 등록시키고, 이미디 또한 AWS S3에 등록시키는 함수 registerQuizWithImage
   * @param param.answers 퀴즈의 정답 목록
   * @param param.imageFiles 등록하고자 하는 퀴즈 이미지 Buffer
   * @param param.presetPin 등록하려는 퀴즈 프리셋 PIN
   * @param param.hints 등록하려는 퀴즈 프리셋 힌트
   */
  static async registerQuizWithImage({
    answers,
    imageFiles,
    presetPin,
    hints,
  }: {
    answers: string[];
    imageFiles: Express.Multer.File[];
    presetPin: string;
    hints: (string | null)[];
  }) {
    await Promise.all(
      imageFiles.map(async (imageFile, index) => {
        const imageUrl = await S3StorageModule.uploadFileToS3({
          fileData: imageFile,
          presetPin,
        });
        const currentIndexAnswer = answers[index];
        const currentIndexHint = hints[index];
        await ModelQuiz.createQuizPreset({
          imageUrl,
          answer: currentIndexAnswer,
          includedPresetPin: presetPin,
          hint: currentIndexHint ? currentIndexHint : undefined,
        });
      }),
    );
  }

  /**
   * 특정 퀴즈 프리셋과 관련 데이터들을 완전히 제거하는 함수 deleteQuizPreset
   * @param param0
   */
  static async deleteQuizPreset({
    imageUrls,
    presetPin,
  }: {
    imageUrls: string[];
    presetPin: string;
  }) {
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        await S3StorageModule.deleteFileFromS3(imageUrl);
      }),
    );

    await ModelQuiz.deleteQuizInPreset(presetPin);
    await ModelQuizPreset.deleteQuizPreset(presetPin);
  }
}

export default ServiceQuiz;
