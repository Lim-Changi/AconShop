import { JwtAuthGuard } from '@app/common/guard/JwtGuard';
import { RoleGuard } from '@app/common/guard/RoleGuard';
import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { BadRequestError } from '@app/common/response/swagger/common/error/BadRequestError';
import { AddCountryFail } from '@app/common/response/swagger/domain/country/AddCountryFail';
import { AddCountryForbiddenFail } from '@app/common/response/swagger/domain/country/AddCountryForbiddenFail';
import { AddCountrySuccess } from '@app/common/response/swagger/domain/country/AddCountrySuccess';
import { GetAllCountryFail } from '@app/common/response/swagger/domain/country/GetAllCountryFail';
import { GetAllCountrySuccess } from '@app/common/response/swagger/domain/country/GetAllCountrySuccess';
import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CountryService } from './country.service';
import { AddCountryReq } from './dto/AddCountryReq';
import { CountryDataRes } from './dto/CountryDataRes';

@Controller('country')
@ApiTags('나라 API')
@UseGuards(RoleGuard([UserRole.EDITOR]))
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
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
  ): Promise<ResponseEntity<CountryDataRes>> {
    try {
      const data: CountryDataRes = await this.countryService.addCountry(
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

  @ApiOperation({
    summary: '전체 나라 조회',
    description: `
    저장되어 있는 모든 나라 데이터 정보를 조회합니다.
    `,
  })
  @ApiOkResponse({
    description: '전체 나라 조회에 성공했습니다.',
    type: GetAllCountrySuccess,
  })
  @ApiInternalServerErrorResponse({
    description: '전체 나라 조회에 실패했습니다',
    type: GetAllCountryFail,
  })
  @Get()
  async getAllCountries(): Promise<ResponseEntity<CountryDataRes[]>> {
    try {
      const data: CountryDataRes[] =
        await this.countryService.getAllCountryData();
      return ResponseEntity.OK_WITH_DATA(
        '전체 나라 조회에 성공했습니다.',
        data,
      );
    } catch (e) {
      throw ResponseEntity.ERROR_WITH('전체 나라 조회에 실패했습니다. >> ' + e);
    }
  }
}
