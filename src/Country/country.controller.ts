import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { BadRequestError } from '@app/common/response/swagger/common/error/BadRequestError';
import { AddCountryFail } from '@app/common/response/swagger/domain/country/AddCountryFail';
import { AddCountryForbiddenFail } from '@app/common/response/swagger/domain/country/AddCountryForbiddenFail';
import { AddCountrySuccess } from '@app/common/response/swagger/domain/country/AddCountrySuccess';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CountryService } from './country.service';
import { AddCountryReq } from './dto/AddCountryReq';
import { AddCountryRes } from './dto/AddCountryRes';

@Controller('country')
@ApiTags('나라 API')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({
    summary: '나라 추가',
    description: `
    나라를 추가할 때 name(이름), exchangeRate(환율), currency(통화)를 입력받습니다. \n
    입력값을 누락한 경우 에러를 출력합니다. \n
    `,
  })
  @ApiCreatedResponse({
    description: '나라 추가에 성공했습니다.',
    type: AddCountrySuccess,
  })
  @ApiBadRequestResponse({
    description: '입력값을 누락',
    type: BadRequestError,
  })
  @ApiForbiddenResponse({
    description: '중복된 나라 실패',
    type: AddCountryForbiddenFail,
  })
  @ApiInternalServerErrorResponse({
    description: '나라 추가에 실패했습니다',
    type: AddCountryFail,
  })
  @Post()
  async addCountry(
    @Body() dto: AddCountryReq,
  ): Promise<ResponseEntity<AddCountryRes>> {
    try {
      const data: AddCountryRes = await this.countryService.addCountry(
        await dto.toEntity(),
      );
      return ResponseEntity.CREATED_WITH_DATA(
        '나라 추가에 성공했습니다.',
        data,
      );
    } catch (e) {
      if (e.status === HttpStatus.FORBIDDEN)
        throw ResponseEntity.FORBIDDEN_WITH(e.message);

      throw ResponseEntity.ERROR_WITH('나라 추가에 실패했습니다. >> ' + e);
    }
  }
}
