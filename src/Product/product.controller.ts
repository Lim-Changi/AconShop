import { JwtAuthGuard } from '@app/common/guard/JwtGuard';
import { RoleGuard } from '@app/common/guard/RoleGuard';
import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { BadRequestError } from '@app/common/response/swagger/common/error/BadRequestError';
import { UserRole } from '@app/entity/domain/user/UserRole';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('나라 API')
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
    type: null,
  })
  @ApiBadRequestResponse({
    description: '입력값을 누락',
    type: BadRequestError,
  })
  @ApiInternalServerErrorResponse({
    description: '상품 제출에 실패했습니다',
    type: null,
  })
  @UseGuards(RoleGuard([UserRole.AUTHOR]))
  @Post('/submit')
  async submitProduct(@Body() dto: any): Promise<ResponseEntity<any>> {
    try {
      const data = null;
      return ResponseEntity.CREATED_WITH_DATA(
        '상품 제출에 성공했습니다.',
        data,
      );
    } catch (e) {
      throw ResponseEntity.ERROR_WITH('상품 제출에 실패했습니다. >> ' + e);
    }
  }
}
