<?php

class DataBase {

	function readDB($filename) {
		$file = file_get_contents($filename);
		return $file;
	}
	
	// декодируем русские символы
	function jdecoder($json_str) {
	  $cyr_chars = array (
		'\u0430' => 'а', '\u0410' => 'А',
		'\u0431' => 'б', '\u0411' => 'Б',
		'\u0432' => 'в', '\u0412' => 'В',
		'\u0433' => 'г', '\u0413' => 'Г',
		'\u0434' => 'д', '\u0414' => 'Д',
		'\u0435' => 'е', '\u0415' => 'Е',
		'\u0451' => 'ё', '\u0401' => 'Ё',
		'\u0436' => 'ж', '\u0416' => 'Ж',
		'\u0437' => 'з', '\u0417' => 'З',
		'\u0438' => 'и', '\u0418' => 'И',
		'\u0439' => 'й', '\u0419' => 'Й',
		'\u043a' => 'к', '\u041a' => 'К',
		'\u043b' => 'л', '\u041b' => 'Л',
		'\u043c' => 'м', '\u041c' => 'М',
		'\u043d' => 'н', '\u041d' => 'Н',
		'\u043e' => 'о', '\u041e' => 'О',
		'\u043f' => 'п', '\u041f' => 'П',
		'\u0440' => 'р', '\u0420' => 'Р',
		'\u0441' => 'с', '\u0421' => 'С',
		'\u0442' => 'т', '\u0422' => 'Т',
		'\u0443' => 'у', '\u0423' => 'У',
		'\u0444' => 'ф', '\u0424' => 'Ф',
		'\u0445' => 'х', '\u0425' => 'Х',
		'\u0446' => 'ц', '\u0426' => 'Ц',
		'\u0447' => 'ч', '\u0427' => 'Ч',
		'\u0448' => 'ш', '\u0428' => 'Ш',
		'\u0449' => 'щ', '\u0429' => 'Щ',
		'\u044a' => 'ъ', '\u042a' => 'Ъ',
		'\u044b' => 'ы', '\u042b' => 'Ы',
		'\u044c' => 'ь', '\u042c' => 'Ь',
		'\u044d' => 'э', '\u042d' => 'Э',
		'\u044e' => 'ю', '\u042e' => 'Ю',
		'\u044f' => 'я', '\u042f' => 'Я',
	 
		'\r' => '',
		'\n' => '<br />',
		'\t' => ''
	  );
	 
	  foreach ($cyr_chars as $key => $value) {
		$json_str = str_replace($key, $value, $json_str);
	  }
	  return $json_str;
	}
	
	function writeDB($filename, $data) {
		
		copy($filename, "../last_backup_database.json");
		$fd = fopen($filename, 'w') or die("не удалось открыть файл");		
		//Записываем дату изменений
		$data['app_last_modified'] = date('F j, Y, g:i a');
		$postData = $this->jdecoder(json_encode($data));
		//print_r($postData);
		fwrite($fd, $postData);
		fclose($fd);
	}

	function add($post,$data)
	{
			//Для новых записей опраделяем максимальный ID в базе, тнкрементируем и добавляем с этим ID  в базу
			$index = $this->get_max_index($data);
			$post['id'] = strval(++$index);
			if(!empty($post['special_price'])) //Т.к. special_price на клиенте это массив объектов
			{	
				$post['special_price'] = json_decode("[".$post['special_price']."]");
			}
			array_push($data['currencies'], $post);			
			//print_r($data);
			$this->writeDB('../database.json', $data);
	}
	
	function edit($post,$data,$id)
	{
		$post["id"] = $id;
		//print_r($data['currencies'][$orderNumber]);
		if(!empty($post['special_price'])) //Т.к. special_price на клиенте это массив объектов
		{	
			$post['special_price'] = json_decode("[".$post['special_price']."]");
		}
		for($i=0; $i<count($data['currencies']); $i++)
		{
			if($data['currencies'][$i]['id'] == $id)
			{
				$data['currencies'][$i] = $post;
				$this->writeDB('../database.json', $data);
				break;
			}
			
		}	
	}
	
	function remove($post,$data)
	{
		for($i=0; $i<count($data['currencies']); $i++)
		{
			if($data['currencies'][$i]['id'] == $post['id'])
			{
				array_splice($data['currencies'], $i,1);//unset($data['currencies'][$post['index']]);
				$this->writeDB('../database.json', $data);
				break;
			}
		}					
	}
	
	function readdir($post)
	{
		$src=$post['src'];
		if ($handle = opendir($src)) 
		{
			$array_flags = Array();
			$i=0;
			/* Именно этот способ чтения элементов каталога является правильным. */
			while (false !== ($file = readdir($handle))) { 
				$is_img_ext = explode(".", $file);
				if(in_array($is_img_ext[1],  array('gif','jpg','png'))) 
				{
					$array_flags[$i]['url'] = $src.$file;
					$array_flags[$i]['file_name'] = $is_img_ext[0];
					$i++;
				}
			}
			echo json_encode($array_flags);
			closedir($handle); 
		}
	}
	
	function save_settings($post,$data)
	{
		foreach($post as $key=>$value)
		{
			$data[$key] = $value;
		}
		$this->writeDB('../database.json', $data);
	}
	
	function get_max_index($data)
	{
		//Определяем наибольший ID в базе. Если пусто, ставим ID=1
		$indexArray = Array();
		foreach($data['currencies'] as $currency)
		{
			array_push($indexArray,intval($currency['id']));
		}
		return (count($indexArray)>0 ? max($indexArray) : 0);
	}
}


	if(!empty($_POST))
	{
		
		$db = new DataBase;
		$data = json_decode($db->readDB('../database.json'), true);
		switch($_GET['f'])
		{
			case "add": 
				$db->add($_POST,$data);
				break;
			case "edit": 
				$db->edit($_POST,$data,$_GET['id']);
				break;
			case "del":
				$db->remove($_POST,$data);
				break;
			case "readdir":
				$db->readdir($_POST,$data);
				break;
			case "save_settings":
				$db->save_settings($_POST,$data);
				break;
		}
		
		//print_r($data);
	}
?>