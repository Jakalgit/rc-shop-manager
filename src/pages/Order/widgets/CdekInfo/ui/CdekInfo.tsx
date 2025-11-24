import {
	CdekDeliveryEnum,
	type CdekDoorAddressType,
	type CdekMetadataType,
	type CdekOfficeAddressType,
	type CdekTariffCode
} from "../../../../../api/order/cdek.types.ts";
import React from "react";
import {defaultStyles, JsonView} from "react-json-view-lite";
import {Accordion, Row, Table} from "react-bootstrap";


interface CdekInfoProps {
	info: CdekMetadataType;
}

export const CdekInfo: React.FC<CdekInfoProps> = ({ info }) => {
	
	const tariffFieldDescriptions: Partial<Record<keyof CdekTariffCode, string>> = {
		'period_max': 'Максимальное время доставки, дни',
		'period_min': 'Минимальное время доставки, дни',
		'tariff_code': 'Код тарифа',
		'tariff_name': 'Название тарифа',
		'delivery_sum': 'Сумма доставки, руб.',
		'tariff_description': 'Описание тарифа',
	};

	const doorDeliveryFieldDescriptions: Partial<Record<keyof CdekDoorAddressType, string>> = {
		'formatted': 'Полный адрес',
		'postal_code': 'Почтовый код',
		'country_code': 'Код страны',
	}
	
	const officeDeliveryFieldDescriptions: Partial<Record<keyof CdekOfficeAddressType, string>> = {
		'city': 'Город',
		'name': 'Название подразделения',
		'address': 'Адрес',
		'city_code': 'Код города',
		'work_time': 'Время работы',
		'weight_max': 'Максимальный вес, граммы',
		'postal_code': 'Почтовый код',
		'country_code': 'Код региона'
	}

	return (
		<Accordion>
			<Accordion.Item eventKey="0">
				<Accordion.Header>Данные СДЕК</Accordion.Header>
				<Accordion.Body>
					<Row>
						<h4 className="mt-4">Данные тарифа</h4>
						<Table bordered hover size="sm">
							<thead>
							<tr>
								<th>
									Данные
								</th>
								<th>
									Значение
								</th>
							</tr>
							</thead>
							<tbody>
							{(Object.keys(tariffFieldDescriptions) as Array<keyof typeof tariffFieldDescriptions>)
								.map((el, i) =>
									<tr key={i}>
										<td>{tariffFieldDescriptions[el]}</td>
										<td>
											{typeof info.rate[el] === "object"
												? JSON.stringify(info.rate[el])
												: info.rate[el]}
										</td>
									</tr>
								)}
							</tbody>
						</Table>

						<h4 className="mt-4">Данные способа доставки</h4>
						<Table bordered hover size="sm">
							<thead>
							<tr>
								<th>
									Данные
								</th>
								<th>
									Значение
								</th>
							</tr>
							</thead>
							<tbody>
							{info.delivery === CdekDeliveryEnum.DOOR &&
								(Object.keys(doorDeliveryFieldDescriptions) as Array<keyof typeof doorDeliveryFieldDescriptions>)
									.map((el, i) =>
										<tr key={i}>
											<td>{doorDeliveryFieldDescriptions[el]}</td>
											<td>
												{typeof info.address[el] === "object"
													? JSON.stringify(info.address[el])
													: info.address[el]}
											</td>
										</tr>
									)
							}
							{info.delivery === CdekDeliveryEnum.OFFICE &&
								(Object.keys(officeDeliveryFieldDescriptions) as Array<keyof typeof officeDeliveryFieldDescriptions>)
									.map((el, i) =>
										<tr key={i}>
											<td>{officeDeliveryFieldDescriptions[el]}</td>
											<td>{info.address[el]}</td>
										</tr>
									)
							}
							</tbody>
						</Table>
					</Row>
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="1">
				<Accordion.Header>Данные СДЕК (JSON)</Accordion.Header>
				<Accordion.Body>
					<Row className="mt-4">
						<h4 className="mb-3">Данные JSON</h4>
						<JsonView data={info} style={defaultStyles}/>
					</Row>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	)
}

export default CdekInfo;