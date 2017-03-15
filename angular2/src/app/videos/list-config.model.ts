export class ListConfig {
  queryParamsFilterDefault: {
    page?: number,
    perpage?: number,
    offset?: number,
  } = {};
  queryParamsFilter: {
    params?: any[]
  } = [];
}
