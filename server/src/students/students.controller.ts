import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { CreateQuoteDto, CreateQuoteSchema } from './dto/create-quote.dto';
import { QuotesService } from './quotes.service';
import { ZodValidationPipe } from 'src/utils/pipes/zodValidationPipe';

@Controller('students')
export class StudentsController {
  constructor(private qoutesService: QuotesService) {}

  @Get()
  findAll() {
    return this.qoutesService.findAll();
  }

  @Get('random')
  findRandom() {
    return this.qoutesService.findRandom();
  }

  @Get('author/:author')
  findOne(@Param('author') author: string) {
    return this.qoutesService.findByAuthor(author);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateQuoteSchema))
  async create(@Body() createQuoteDto: CreateQuoteDto) {
    console.log(createQuoteDto);
    return this.qoutesService.create(createQuoteDto);
  }
}
