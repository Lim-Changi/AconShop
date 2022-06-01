import { CurrentUser } from '@app/common/decorator/currentUser.decorator';
import { JwtAuthGuard } from '@app/common/guard/JwtGuard';
import { RoleGuard } from '@app/common/guard/RoleGuard';
import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { BadRequestError } from '@app/common/response/swagger/common/error/BadRequestError';
import { GetPendingProductFail } from '@app/common/response/swagger/domain/product/GetPendingProductFail';
import { GetPendingProductSuccess } from '@app/common/response/swagger/domain/product/GetPendingProductSuccess';
import { ReviewProductBadRquestFail } from '@app/common/response/swagger/domain/product/ReviewProductBadRequestFail';
import { ReviewProductFail } from '@app/common/response/swagger/domain/product/ReviewProductFail';
import { ReviewProductSuccess } from '@app/common/response/swagger/domain/product/ReviewProductSuccess';
import { SubmitProductFail } from '@app/common/response/swagger/domain/product/SubmitProductFail';
import { SubmitProductSuccess } from '@app/common/response/swagger/domain/product/SubmitProductSuccess';
import { UserPayload } from '@app/entity/domain/user/dao/UserPayload';
import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetPendingProductRes } from './dto/GetPendingProductRes';
import { ReviewProductReq } from './dto/ReviewProductReq';
import { ProductDataRes } from './dto/ProductDataRes';
import { SubmitProductReq } from './dto/SubmitProductReq';
import { SubmitProductRes } from './dto/SubmitProductRes';
import { ProductService } from './product.service';
import { AddForiegnProductReq } from './dto/AddForeignProductReq';

@Controller('product')
@ApiTags('상품 API')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: '작가 상품 제출',
    description: `
    나라를 추가할 때 name(이름), exchangeRate(환율), currency(통화)를 입력받습니다. \n
    입력값을 누락한 경우 에러를 출력합니다. \n
    `,
  })
  @ApiCreatedResponse({
    description: '상품 제출에 성공했습니다.',
    type: SubmitProductSuccess,
  })
  @ApiBadRequestResponse({
    description: '입력값을 누락',
    type: BadRequestError,
  })
  @ApiInternalServerErrorResponse({
    description: '상품 제출에 실패했습니다',
    type: SubmitProductFail,
  })
  @UseGuards(RoleGuard([UserRole.AUTHOR]))
  @Post('/submit')
  async submitProduct(
    @CurrentUser() userDto: UserPayload,
    @Body() productDto: SubmitProductReq,
  ): Promise<ResponseEntity<SubmitProductRes>> {
    try {
      const data = await this.productService.submitProduct(
        productDto.toEntity(),
        userDto,
      );
      return ResponseEntity.CREATED_WITH_DATA(
        '상품 제출에 성공했습니다.',
        data,
      );
    } catch (e) {
      throw ResponseEntity.ERROR_WITH('상품 제출에 실패했습니다. >> ' + e);
    }
  }

  @ApiOperation({
    summary: '검토 대기 상품 확인',
    description: `
    검토 대기중인 상품을 확인합니다.
    `,
  })
  @ApiOkResponse({
    description: '검토 대기 상품 확인에 성공했습니다.',
    type: GetPendingProductSuccess,
  })
  @ApiInternalServerErrorResponse({
    description: '검토 대기 상품 확인에 실패했습니다',
    type: GetPendingProductFail,
  })
  @UseGuards(RoleGuard([UserRole.EDITOR]))
  @Get('/pending')
  async getPendingProduct(): Promise<ResponseEntity<GetPendingProductRes[]>> {
    try {
      const data = await this.productService.getPendingProduct();
      return ResponseEntity.CREATED_WITH_DATA(
        '검토 대기 상품 확인에 성공했습니다.',
        data,
      );
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(
        '검토 대기 상품 확인에 실패했습니다. >> ' + e,
      );
    }
  }

  @ApiOperation({
    summary: '상품 검토 및 수정',
    description: `
    검토 대기중인 상품을 검토 및 수정합니다.\n
    상품의 제목, 본문, 가격, 수수료, 검토 상태를 수정할 수 있습니다.\n
    검토 상태를 성공으로 수정시, 수수료를 입력해야만 합니다.
    `,
  })
  @ApiCreatedResponse({
    description: '상품 검토 및 수정에 성공했습니다.',
    type: ReviewProductSuccess,
  })
  @ApiBadRequestResponse({
    description: '입력 데이터가 비정상입니다.',
    type: ReviewProductBadRquestFail,
  })
  @ApiInternalServerErrorResponse({
    description: '상품 검토 및 수정에 실패했습니다',
    type: ReviewProductFail,
  })
  @UseGuards(RoleGuard([UserRole.EDITOR]))
  @Put('/review')
  async reviewPendingProduct(
    @CurrentUser() userDto: UserPayload,
    @Body() productDto: ReviewProductReq,
  ): Promise<ResponseEntity<ProductDataRes>> {
    try {
      const data = await this.productService.reviewProduct(
        productDto.toEntity(),
        userDto,
      );
      return ResponseEntity.CREATED_WITH_DATA(
        '상품 검토 및 수정에 성공했습니다.',
        data,
      );
    } catch (e) {
      if (e.status === HttpStatus.BAD_REQUEST)
        throw ResponseEntity.BAD_REQUEST_WITH(e.message);
      throw ResponseEntity.ERROR_WITH(
        '상품 검토 및 수정에 실패했습니다. >> ' + e,
      );
    }
  }

  @ApiOperation({
    summary: '기존 상품 타 국가정보 추가',
    description: `
    검토가 완료된 상품의 타 국가정보를 추가합니다. \n
    상품ID(대한민국 기준), 국가ID, 번역된 제목, 본문 총 네가지를 입력받습니다. \n
    누락된 값이 존재하면 오류를 반환합니다. \n
    존재하지 않는 상품ID, 검증이 끝나지 않은 상품ID, 대한민국 상품이 아닌 ID, 존재하지 않는 국가ID 의 경우 오류를 반환합니다.
    `,
  })
  @ApiCreatedResponse({
    description: '상품 타 국가정보 추가에 성공했습니다.',
    type: SubmitProductSuccess,
  })
  @ApiInternalServerErrorResponse({
    description: '상품 타 국가정보 추가에 실패했습니다',
    type: SubmitProductFail,
  })
  @UseGuards(RoleGuard([UserRole.EDITOR]))
  @Post('/foreign')
  async addForeignProduct(
    @CurrentUser() userDto: UserPayload,
    @Body() productDto: AddForiegnProductReq,
  ): Promise<ResponseEntity<ProductDataRes>> {
    try {
      const data = null;
      return ResponseEntity.CREATED_WITH_DATA(
        '상품 타 국가정보 추가에 성공했습니다.',
        data,
      );
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(
        '상품 타 국가정보 추가에 실패했습니다. >> ' + e,
      );
    }
  }

  @ApiOperation({
    summary: '나라별 상품 조회',
    description: `
    각 나라별 상품을 조회합니다.. \n
    국가ID 를 입력받습니다. \n
    누락된 값이 존재하면 오류를 반환합니다. \n
    존재하지 않는 국가ID 의 경우 오류를 반환합니다.
    `,
  })
  @ApiCreatedResponse({
    description: '나라별 상품 조회에 성공했습니다.',
    type: SubmitProductSuccess,
  })
  @ApiInternalServerErrorResponse({
    description: '나라별 상품 조회에 실패했습니다',
    type: SubmitProductFail,
  })
  @Get()
  async getCountryProduct(): Promise<ResponseEntity<ProductDataRes[]>> {
    try {
      const data = null;
      return ResponseEntity.CREATED_WITH_DATA(
        '나라별 상품 조회에 성공했습니다.',
        data,
      );
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(
        '나라별 상품 조회에 실패했습니다. >> ' + e,
      );
    }
  }
}
