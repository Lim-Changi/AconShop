import { CurrentUser } from '@app/common/decorator/currentUser.decorator';
import { JwtAuthGuard } from '@app/common/guard/JwtGuard';
import { RoleGuard } from '@app/common/guard/RoleGuard';
import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { BadRequestError } from '@app/common/response/swagger/common/error/BadRequestError';
import { PurchaseProductFail } from '@app/common/response/swagger/domain/purchase/PurchaseProductFail';
import { PurchaseProductForbiddenFail } from '@app/common/response/swagger/domain/purchase/PurchaseProductForbiddenFail';
import { PurchaseProductSuccess } from '@app/common/response/swagger/domain/purchase/PurchaseProductSuccess';
import { UserPayload } from '@app/entity/domain/user/dao/UserPayload';
import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PurchaseProductReq } from './dto/PurchaseProductReq';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
@ApiTags('결제 API')
@UseGuards(RoleGuard([UserRole.CUSTOMER]))
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @ApiOperation({
    summary: '고객 상품 구매',
    description: `
    구매하고자하는 상품의 ID 를 입력받습니다. \n
    상품이 존재하지 않거나, 검수가 완료되지 않은 경우 403 에러를 반환합니다. \n
    입력값을 누락한 경우 에러를 출력합니다.
    `,
  })
  @ApiCreatedResponse({
    description: '상품 구매에 성공했습니다.',
    type: PurchaseProductSuccess,
  })
  @ApiBadRequestResponse({
    description: '입력값을 누락',
    type: BadRequestError,
  })
  @ApiForbiddenResponse({
    description: '잘못된 상품입니다.',
    type: PurchaseProductForbiddenFail,
  })
  @ApiInternalServerErrorResponse({
    description: '상품 구매에 실패했습니다',
    type: PurchaseProductFail,
  })
  @Post()
  async purchaseProduct(
    @CurrentUser() userDto: UserPayload,
    @Body() productDto: PurchaseProductReq,
  ): Promise<ResponseEntity<string>> {
    try {
      await this.purchaseService.purchaseProduct(
        productDto.toEntity(),
        userDto,
      );
      return ResponseEntity.CREATED_WITH('상품 구매에 성공했습니다.');
    } catch (e) {
      if (e.status === HttpStatus.FORBIDDEN)
        throw ResponseEntity.FORBIDDEN_WITH(e.message);
      throw ResponseEntity.ERROR_WITH('상품 구매에 실패했습니다. >> ' + e);
    }
  }
}
