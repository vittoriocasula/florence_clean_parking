import { NgModule } from '@angular/core';
import { AddressQueryPipe } from './address-query.pipe';
import { DateHeaderPipe } from './date-header.pipe';

@NgModule({
declarations: [AddressQueryPipe, DateHeaderPipe],
imports: [],
exports: [AddressQueryPipe, DateHeaderPipe],
})

export class PipesModule {}
